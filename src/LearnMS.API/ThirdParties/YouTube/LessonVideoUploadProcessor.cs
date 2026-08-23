using System.Threading.Channels;
using LearnMS.API.Features.Courses;
using LearnMS.API.Features.Courses.Contracts;

namespace LearnMS.API.ThirdParties.YouTube;

public sealed record LessonVideoUploadJob
{
    public required Guid CourseId { get; init; }
    public required Guid LectureId { get; init; }
    public required Guid LessonId { get; init; }
    public required string FilePath { get; init; }
}

public sealed class LessonVideoUploadQueue
{
    private readonly Channel<LessonVideoUploadJob> _channel =
        Channel.CreateUnbounded<LessonVideoUploadJob>(new UnboundedChannelOptions
        {
            SingleReader = true
        });

    public ValueTask EnqueueAsync(LessonVideoUploadJob job, CancellationToken cancellationToken = default) =>
        _channel.Writer.WriteAsync(job, cancellationToken);

    public IAsyncEnumerable<LessonVideoUploadJob> ReadAllAsync(CancellationToken cancellationToken) =>
        _channel.Reader.ReadAllAsync(cancellationToken);
}

public sealed class LessonVideoUploadWorker : BackgroundService
{
    private readonly LessonVideoUploadQueue _queue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<LessonVideoUploadWorker> _logger;

    public LessonVideoUploadWorker(
        LessonVideoUploadQueue queue,
        IServiceScopeFactory scopeFactory,
        ILogger<LessonVideoUploadWorker> logger
    )
    {
        _queue = queue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var job in _queue.ReadAllAsync(stoppingToken))
        {
            try
            {
                await using var scope = _scopeFactory.CreateAsyncScope();
                var courses = scope.ServiceProvider.GetRequiredService<ICoursesService>();
                await using var fs = File.OpenRead(job.FilePath);
                await courses.ExecuteAsync(new UploadLessonVideoCommand
                {
                    CourseId = job.CourseId,
                    LectureId = job.LectureId,
                    LessonId = job.LessonId,
                    FS = fs
                });
                _logger.LogInformation("Published lesson video for {LessonId}", job.LessonId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish lesson video for {LessonId}", job.LessonId);
            }
            finally
            {
                try
                {
                    if (File.Exists(job.FilePath))
                        File.Delete(job.FilePath);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Could not delete temporary lesson video {Path}", job.FilePath);
                }
            }
        }
    }
}
