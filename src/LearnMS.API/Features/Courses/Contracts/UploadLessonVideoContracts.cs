namespace LearnMS.API.Features.Courses.Contracts;

public record UploadLessonVideoCommand
{
    public required Guid CourseId { get; set; }
    public required Guid LectureId { get; set; }
    public required Guid LessonId { get; set; }
    public required Stream FS { get; set; }
}

public record SetLessonVideoStateCommand
{
    public required Guid CourseId { get; init; }
    public required Guid LectureId { get; init; }
    public required Guid LessonId { get; init; }
    public required string? VideoId { get; init; }
}

public static class LessonVideoStates
{
    public const string Pending = "pending";
    public const string Failed = "failed";
    public const string FailedPrefix = "failed:";

    public static bool IsFailed(string? videoId) =>
        videoId == Failed
        || videoId?.StartsWith(FailedPrefix, StringComparison.Ordinal) == true;

    public static string MarkFailed(string? reason)
    {
        var clean = string.IsNullOrWhiteSpace(reason)
            ? "Publishing to YouTube failed."
            : reason.Replace('\n', ' ').Trim();
        if (clean.Length > 280)
            clean = clean[..280];
        return FailedPrefix + clean;
    }

    public static string? ErrorMessage(string? videoId)
    {
        if (videoId?.StartsWith(FailedPrefix, StringComparison.Ordinal) == true)
            return videoId[FailedPrefix.Length..];
        return null;
    }
}