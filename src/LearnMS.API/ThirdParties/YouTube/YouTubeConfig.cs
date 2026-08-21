namespace LearnMS.API.ThirdParties.YouTube;

public sealed class YouTubeConfig
{
    public const string Section = "YouTube";

    public string ClientId { get; set; } = "";
    public string ClientSecret { get; set; } = "";
    public string RefreshToken { get; set; } = "";
    public string RedirectUri { get; set; } = "";
}
