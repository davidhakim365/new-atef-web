using System.Text.Json;
using LearnMS.API.Common;
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

public sealed class LessonVideoUploadWorker : BackgroundService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LessonVideoUploadWorker> _logger;

    public LessonVideoUploadWorker(
        IServiceScopeFactory scopeFactory,
        IWebHostEnvironment environment,
        IConfiguration configuration,
        ILogger<LessonVideoUploadWorker> logger
    )
    {
        _scopeFactory = scopeFactory;
        _environment = environment;
        _configuration = configuration;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var job = ReadNextDiskJob();
            if (job is null)
            {
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
                continue;
            }

            await ProcessAsync(job);
        }
    }

    public static void WriteJob(LessonVideoUploadJob job)
    {
        File.WriteAllText(JobPath(job.FilePath), JsonSerializer.Serialize(job, JsonOptions));
    }

    private LessonVideoUploadJob? ReadNextDiskJob()
    {
        try
        {
            var root = LessonVideoStorage.EnsureRoot(_environment, _configuration);
            var processing = Path.Combine(root, "processing");
            var jobFile = Directory.GetFiles(processing, "*.job.json")
                .OrderBy(File.GetCreationTimeUtc)
                .FirstOrDefault();
            if (jobFile is null)
                return null;

            var workingPath = jobFile + ".working";
            try
            {
                File.Move(jobFile, workingPath, overwrite: true);
            }
            catch
            {
                return null;
            }

            var job = JsonSerializer.Deserialize<LessonVideoUploadJob>(File.ReadAllText(workingPath), JsonOptions);
            if (job is null || !File.Exists(job.FilePath))
            {
                File.Delete(workingPath);
                return null;
            }

            return job with { FilePath = job.FilePath };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Could not read queued lesson video jobs from disk");
            return null;
        }
    }

    private async Task ProcessAsync(LessonVideoUploadJob job)
    {
        var workingJobPath = JobPath(job.FilePath) + ".working";
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
            try
            {
                var reason = ex is ApiException api ? api.Error.Message : ex.Message;
                await using var scope = _scopeFactory.CreateAsyncScope();
                var courses = scope.ServiceProvider.GetRequiredService<ICoursesService>();
                await courses.ExecuteAsync(new SetLessonVideoStateCommand
                {
                    CourseId = job.CourseId,
                    LectureId = job.LectureId,
                    LessonId = job.LessonId,
                    VideoId = LessonVideoStates.MarkFailed(reason)
                });
            }
            catch (Exception markEx)
            {
                _logger.LogError(markEx, "Could not mark lesson {LessonId} video as failed", job.LessonId);
            }
        }
        finally
        {
            TryDelete(job.FilePath);
            TryDelete(JobPath(job.FilePath));
            TryDelete(workingJobPath);
        }
    }

    private static string JobPath(string filePath) => filePath + ".job.json";

    private void TryDelete(string path)
    {
        try
        {
            if (File.Exists(path))
                File.Delete(path);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Could not delete {Path}", path);
        }
    }
}
