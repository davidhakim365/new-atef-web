using LearnMS.API.Common;

namespace LearnMS.API.ThirdParties.YouTube;

public static class YouTubeErrors
{
    public static readonly ApiError NotConfigured = new(
        "youtube/not-configured",
        "YouTube is not connected. Sign in with the channel that should host lesson videos.",
        StatusCodes.Status400BadRequest
    );

    public static readonly ApiError UploadFailed = new(
        "youtube/upload-failed",
        "Failed to upload the video. Please try again.",
        StatusCodes.Status502BadGateway
    );

    public static readonly ApiError InvalidPlayback = new(
        "youtube/invalid-playback",
        "This video is unavailable.",
        StatusCodes.Status403Forbidden
    );
}
