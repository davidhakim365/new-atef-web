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
}