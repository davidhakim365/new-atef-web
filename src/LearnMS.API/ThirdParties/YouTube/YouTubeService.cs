using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using LearnMS.API.Common;
using LearnMS.API.Security.JwtBearer;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace LearnMS.API.ThirdParties.YouTube;

public sealed class YouTubeService
{
    private static readonly Regex YouTubeIdRegex = new("^[A-Za-z0-9_-]{11}$", RegexOptions.Compiled);
    private static readonly string[] UploadScopes =
    [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube"
    ];

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IWebHostEnvironment _environment;
    private readonly YouTubeConfig _config;
    private readonly byte[] _tokenKey;
    private readonly SemaphoreSlim _tokenLock = new(1, 1);
    private readonly object _fileLock = new();

    private string? _accessToken;
    private DateTimeOffset _accessTokenExpiresAt;

    public YouTubeService(
        IHttpClientFactory httpClientFactory,
        IWebHostEnvironment environment,
        IOptions<YouTubeConfig> config,
        IOptions<JwtBearerConfig> jwtConfig
    )
    {
        _httpClientFactory = httpClientFactory;
        _environment = environment;
        _config = config.Value;
        _tokenKey = SHA256.HashData(Encoding.UTF8.GetBytes(jwtConfig.Value.Secret ?? "learnms-youtube"));
    }

    public bool IsConfigured()
    {
        return HasValue(_config.ClientId)
            && HasValue(_config.ClientSecret)
            && HasValue(GetRefreshToken());
    }

    public static bool IsYouTubeVideoId(string? videoId) =>
        !string.IsNullOrWhiteSpace(videoId) && YouTubeIdRegex.IsMatch(videoId);

    public static string? TryParseVideoId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        value = value.Trim();
        if (IsYouTubeVideoId(value))
            return value;

        if (!value.Contains("://", StringComparison.Ordinal))
            value = "https://" + value;

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
            return null;

        var query = QueryHelpers.ParseQuery(uri.Query);
        if (query.TryGetValue("v", out var fromQuery) && IsYouTubeVideoId(fromQuery.ToString()))
            return fromQuery.ToString();

        var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (uri.Host.Contains("youtu.be", StringComparison.OrdinalIgnoreCase) && segments.Length >= 1 && IsYouTubeVideoId(segments[0]))
            return segments[0];

        if (segments.Length >= 2 &&
            (segments[0].Equals("embed", StringComparison.OrdinalIgnoreCase) || segments[0].Equals("shorts", StringComparison.OrdinalIgnoreCase)) &&
            IsYouTubeVideoId(segments[1]))
            return segments[1];

        return null;
    }

    public VideoOTP CreatePlaybackOtp(string videoId)
    {
        var payload = JsonSerializer.Serialize(new PlaybackPayload
        {
            VideoId = videoId,
            Exp = DateTimeOffset.UtcNow.AddHours(4).ToUnixTimeSeconds()
        });

        return new VideoOTP
        {
            Otp = Encrypt(payload),
            PlaybackInfo = "embed"
        };
    }

    public bool TryResolvePlaybackToken(string? token, out string videoId)
    {
        videoId = "";
        if (string.IsNullOrWhiteSpace(token))
            return false;

        try
        {
            var json = Decrypt(token);
            var payload = JsonSerializer.Deserialize<PlaybackPayload>(json);
            if (payload is null || payload.Exp < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
                return false;
            if (!IsYouTubeVideoId(payload.VideoId))
                return false;

            videoId = payload.VideoId;
            return true;
        }
        catch
        {
            return false;
        }
    }

    public string GetAuthorizationUrl(string redirectUri)
    {
        if (!HasValue(_config.ClientId) || !HasValue(_config.ClientSecret))
            throw new ApiException(YouTubeErrors.NotConfigured);

        var query = new Dictionary<string, string>
        {
            ["client_id"] = _config.ClientId,
            ["redirect_uri"] = redirectUri,
            ["response_type"] = "code",
            ["scope"] = string.Join(" ", UploadScopes),
            ["access_type"] = "offline",
            ["prompt"] = "consent",
            ["include_granted_scopes"] = "true"
        };

        return "https://accounts.google.com/o/oauth2/v2/auth?" + string.Join(
            "&",
            query.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}")
        );
    }

    public async Task<string> CompleteOAuthAsync(string code, string redirectUri, CancellationToken cancellationToken = default)
    {
        var client = _httpClientFactory.CreateClient("YouTubeApi");
        using var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["code"] = code,
            ["client_id"] = _config.ClientId,
            ["client_secret"] = _config.ClientSecret,
            ["redirect_uri"] = redirectUri,
            ["grant_type"] = "authorization_code"
        });

        var response = await client.PostAsync("https://oauth2.googleapis.com/token", content, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
            throw new ApiException(YouTubeErrors.NotConfigured);

        using var doc = JsonDocument.Parse(body);
        if (!doc.RootElement.TryGetProperty("refresh_token", out var refreshTokenEl))
            throw new ApiException(YouTubeErrors.NotConfigured);

        var refreshToken = refreshTokenEl.GetString();
        if (!HasValue(refreshToken))
            throw new ApiException(YouTubeErrors.NotConfigured);

        SaveRefreshToken(refreshToken!);

        if (doc.RootElement.TryGetProperty("access_token", out var accessTokenEl))
        {
            _accessToken = accessTokenEl.GetString();
            var expiresIn = doc.RootElement.TryGetProperty("expires_in", out var exp)
                ? exp.GetInt32()
                : 3500;
            _accessTokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(expiresIn - 60);
        }

        return refreshToken!;
    }

    public async Task<string> UploadVideoAsync(Stream fs, string title, string? existingVideoId = null)
    {
        if (!IsConfigured())
            throw new ApiException(YouTubeErrors.NotConfigured);

        if (IsYouTubeVideoId(existingVideoId))
        {
            try
            {
                await DeleteVideoAsync(existingVideoId!);
            }
            catch
            {
                // Replacing a missing or already-deleted video should still succeed.
            }
        }

        var tempPath = Path.Combine(Path.GetTempPath(), $"lesson-{Guid.NewGuid():N}.bin");
        try
        {
            await using (var temp = File.Create(tempPath))
            {
                await fs.CopyToAsync(temp);
            }

            await using var fileStream = File.OpenRead(tempPath);
            return await UploadFileAsync(fileStream, title);
        }
        finally
        {
            if (File.Exists(tempPath))
                File.Delete(tempPath);
        }
    }

    public async Task DeleteVideoAsync(string videoId)
    {
        if (!IsYouTubeVideoId(videoId) || !IsConfigured())
            return;

        var accessToken = await GetAccessTokenAsync();
        var client = _httpClientFactory.CreateClient("YouTubeApi");
        using var request = new HttpRequestMessage(
            HttpMethod.Delete,
            $"https://www.googleapis.com/youtube/v3/videos?id={Uri.EscapeDataString(videoId)}"
        );
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        await client.SendAsync(request);
    }

    private async Task<string> UploadFileAsync(FileStream fileStream, string title)
    {
        var accessToken = await GetAccessTokenAsync();
        var client = _httpClientFactory.CreateClient("YouTubeApi");
        var safeTitle = string.IsNullOrWhiteSpace(title) ? "Lesson" : title.Trim();
        if (safeTitle.Length > 90)
            safeTitle = safeTitle[..90];

        var metadata = JsonSerializer.Serialize(new
        {
            snippet = new
            {
                title = safeTitle,
                description = "Private lesson video",
                categoryId = "27"
            },
            status = new
            {
                privacyStatus = "unlisted",
                embeddable = true,
                publicStatsViewable = false,
                selfDeclaredMadeForKids = false
            }
        });

        using var initRequest = new HttpRequestMessage(
            HttpMethod.Post,
            "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"
        );
        initRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        initRequest.Headers.TryAddWithoutValidation("X-Upload-Content-Type", "video/*");
        initRequest.Headers.TryAddWithoutValidation("X-Upload-Content-Length", fileStream.Length.ToString());
        initRequest.Content = new StringContent(metadata, Encoding.UTF8, "application/json");

        var initResponse = await client.SendAsync(initRequest);
        if (initResponse.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            InvalidateAccessToken();
            accessToken = await GetAccessTokenAsync();
            using var retry = new HttpRequestMessage(
                HttpMethod.Post,
                "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"
            );
            retry.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            retry.Headers.TryAddWithoutValidation("X-Upload-Content-Type", "video/*");
            retry.Headers.TryAddWithoutValidation("X-Upload-Content-Length", fileStream.Length.ToString());
            retry.Content = new StringContent(metadata, Encoding.UTF8, "application/json");
            initResponse.Dispose();
            initResponse = await client.SendAsync(retry);
        }

        using (initResponse)
        {
            if (!initResponse.IsSuccessStatusCode || initResponse.Headers.Location is null)
                throw new ApiException(YouTubeErrors.UploadFailed);

            var uploadUrl = initResponse.Headers.Location;
            return await UploadChunksAsync(client, uploadUrl, fileStream, accessToken);
        }
    }

    private static async Task<string> UploadChunksAsync(
        HttpClient client,
        Uri uploadUrl,
        FileStream fileStream,
        string accessToken
    )
    {
        const int chunkSize = 8 * 1024 * 1024;
        var buffer = new byte[chunkSize];
        long offset = 0;
        var total = fileStream.Length;

        while (offset < total)
        {
            var read = await fileStream.ReadAsync(buffer.AsMemory(0, (int)Math.Min(chunkSize, total - offset)));
            if (read <= 0)
                break;

            var end = offset + read - 1;
            using var chunk = new ByteArrayContent(buffer, 0, read);
            chunk.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            chunk.Headers.ContentRange = new ContentRangeHeaderValue(offset, end, total);

            using var request = new HttpRequestMessage(HttpMethod.Put, uploadUrl) { Content = chunk };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using var response = await client.SendAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.PermanentRedirect
                || (int)response.StatusCode == 308)
            {
                offset += read;
                continue;
            }

            if (!response.IsSuccessStatusCode)
                throw new ApiException(YouTubeErrors.UploadFailed);

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var id = doc.RootElement.GetProperty("id").GetString();
            if (!IsYouTubeVideoId(id))
                throw new ApiException(YouTubeErrors.UploadFailed);

            return id!;
        }

        throw new ApiException(YouTubeErrors.UploadFailed);
    }

    private async Task<string> GetAccessTokenAsync()
    {
        await _tokenLock.WaitAsync();
        try
        {
            if (!string.IsNullOrWhiteSpace(_accessToken) && _accessTokenExpiresAt > DateTimeOffset.UtcNow)
                return _accessToken!;

            var refreshToken = GetRefreshToken();
            if (!HasValue(refreshToken))
                throw new ApiException(YouTubeErrors.NotConfigured);

            var client = _httpClientFactory.CreateClient("YouTubeApi");
            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = _config.ClientId,
                ["client_secret"] = _config.ClientSecret,
                ["refresh_token"] = refreshToken!,
                ["grant_type"] = "refresh_token"
            });

            var response = await client.PostAsync("https://oauth2.googleapis.com/token", content);
            var body = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
                throw new ApiException(YouTubeErrors.NotConfigured);

            using var doc = JsonDocument.Parse(body);
            _accessToken = doc.RootElement.GetProperty("access_token").GetString();
            var expiresIn = doc.RootElement.TryGetProperty("expires_in", out var exp) ? exp.GetInt32() : 3500;
            _accessTokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(expiresIn - 60);

            if (string.IsNullOrWhiteSpace(_accessToken))
                throw new ApiException(YouTubeErrors.NotConfigured);

            return _accessToken;
        }
        finally
        {
            _tokenLock.Release();
        }
    }

    private void InvalidateAccessToken()
    {
        _accessToken = null;
        _accessTokenExpiresAt = DateTimeOffset.MinValue;
    }

    private string? GetRefreshToken()
    {
        if (HasValue(_config.RefreshToken))
            return _config.RefreshToken;

        var path = TokenFilePath();
        if (!File.Exists(path))
            return null;

        lock (_fileLock)
        {
            try
            {
                var json = File.ReadAllText(path);
                var stored = JsonSerializer.Deserialize<YouTubeOAuthToken>(json);
                return HasValue(stored?.RefreshToken) ? stored!.RefreshToken : null;
            }
            catch
            {
                return null;
            }
        }
    }

    private void SaveRefreshToken(string refreshToken)
    {
        lock (_fileLock)
        {
            var json = JsonSerializer.Serialize(new YouTubeOAuthToken { RefreshToken = refreshToken });
            File.WriteAllText(TokenFilePath(), json);
        }
    }

    private string TokenFilePath() => Path.Combine(_environment.ContentRootPath, "youtube-oauth.json");

    private static bool HasValue(string? value) =>
        !string.IsNullOrWhiteSpace(value) && value != "*";

    private string Encrypt(string plaintext)
    {
        var nonce = RandomNumberGenerator.GetBytes(12);
        var bytes = Encoding.UTF8.GetBytes(plaintext);
        var cipher = new byte[bytes.Length];
        var tag = new byte[16];
        using var gcm = new AesGcm(_tokenKey, 16);
        gcm.Encrypt(nonce, bytes, cipher, tag);

        var packed = new byte[nonce.Length + cipher.Length + tag.Length];
        Buffer.BlockCopy(nonce, 0, packed, 0, nonce.Length);
        Buffer.BlockCopy(cipher, 0, packed, nonce.Length, cipher.Length);
        Buffer.BlockCopy(tag, 0, packed, nonce.Length + cipher.Length, tag.Length);
        return Base64UrlEncode(packed);
    }

    private string Decrypt(string token)
    {
        var packed = Base64UrlDecode(token);
        if (packed.Length < 28)
            throw new CryptographicException();

        var nonce = packed.AsSpan(0, 12).ToArray();
        var tag = packed.AsSpan(packed.Length - 16, 16).ToArray();
        var cipher = packed.AsSpan(12, packed.Length - 28).ToArray();
        var plaintext = new byte[cipher.Length];
        using var gcm = new AesGcm(_tokenKey, 16);
        gcm.Decrypt(nonce, cipher, tag, plaintext);
        return Encoding.UTF8.GetString(plaintext);
    }

    private static string Base64UrlEncode(byte[] data) =>
        Convert.ToBase64String(data).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[] Base64UrlDecode(string value)
    {
        var padded = value.Replace('-', '+').Replace('_', '/');
        switch (padded.Length % 4)
        {
            case 2: padded += "=="; break;
            case 3: padded += "="; break;
        }
        return Convert.FromBase64String(padded);
    }

    private sealed class PlaybackPayload
    {
        public string VideoId { get; set; } = "";
        public long Exp { get; set; }
    }
}
