using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using LearnMS.API.Common;
using Microsoft.Extensions.Options;

namespace LearnMS.API.ThirdParties.ImgBB;

public sealed class ImgBBService(IHttpClientFactory httpClientFactory, IOptions<ImgBBConfig> options)
{
    private static readonly HashSet<string> AllowedTypes =
    [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    public async Task<(string Url, string? ThumbUrl)> UploadAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        var apiKey = options.Value.ApiKey?.Trim();
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "*")
            throw new ApiException(ImgBBErrors.NotConfigured);

        if (file.Length <= 0)
            throw new ApiException(ImgBBErrors.InvalidImage);

        if (file.Length > 10 * 1024 * 1024)
            throw new ApiException(ImgBBErrors.ImageTooLarge);

        var contentType = file.ContentType?.ToLowerInvariant() ?? "";
        if (!AllowedTypes.Contains(contentType) && !HasImageExtension(file.FileName))
            throw new ApiException(ImgBBErrors.InvalidImage);

        var client = httpClientFactory.CreateClient("ImgBB");

        await using var stream = file.OpenReadStream();
        using var content = new MultipartFormDataContent();
        using var imageContent = new StreamContent(stream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue(
            string.IsNullOrWhiteSpace(contentType) ? "application/octet-stream" : contentType
        );
        content.Add(imageContent, "image", file.FileName);

        using var response = await client.PostAsync(
            $"https://api.imgbb.com/1/upload?key={Uri.EscapeDataString(apiKey)}",
            content,
            cancellationToken
        );

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        ImgBBUploadResponse? parsed = null;
        try
        {
            parsed = JsonSerializer.Deserialize<ImgBBUploadResponse>(body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (JsonException)
        {
            throw new ApiException(ImgBBErrors.UploadFailed);
        }

        var url = parsed?.Data?.DisplayUrl ?? parsed?.Data?.Url;
        if (!response.IsSuccessStatusCode || parsed?.Success != true || string.IsNullOrWhiteSpace(url))
            throw new ApiException(ImgBBErrors.UploadFailed);

        return (url, parsed.Data?.Thumb?.Url);
    }

    private static bool HasImageExtension(string? fileName)
    {
        var ext = Path.GetExtension(fileName ?? "").ToLowerInvariant();
        return ext is ".jpg" or ".jpeg" or ".png" or ".webp" or ".gif";
    }

    private sealed class ImgBBUploadResponse
    {
        public ImgBBData? Data { get; set; }
        public bool Success { get; set; }
    }

    private sealed class ImgBBData
    {
        public string? Url { get; set; }

        [JsonPropertyName("display_url")]
        public string? DisplayUrl { get; set; }

        public ImgBBThumb? Thumb { get; set; }
    }

    private sealed class ImgBBThumb
    {
        public string? Url { get; set; }
    }
}

public static class ImgBBErrors
{
    public static readonly ApiError NotConfigured = new(
        "imgbb/not-configured",
        "Image upload is not configured. Ask the teacher to add the ImgBB API key.",
        StatusCodes.Status503ServiceUnavailable
    );

    public static readonly ApiError InvalidImage = new(
        "imgbb/invalid-image",
        "Please upload a valid transfer image (JPG, PNG, WEBP, or GIF).",
        StatusCodes.Status400BadRequest
    );

    public static readonly ApiError ImageTooLarge = new(
        "imgbb/image-too-large",
        "Transfer image must be smaller than 10 MB.",
        StatusCodes.Status400BadRequest
    );

    public static readonly ApiError UploadFailed = new(
        "imgbb/upload-failed",
        "Could not upload the transfer image. Please try again.",
        StatusCodes.Status502BadGateway
    );
}
