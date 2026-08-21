using System.Text.Json.Serialization;

namespace LearnMS.API.ThirdParties.YouTube;

internal sealed class YouTubeOAuthToken
{
    [JsonPropertyName("refreshToken")]
    public string RefreshToken { get; set; } = "";
}
