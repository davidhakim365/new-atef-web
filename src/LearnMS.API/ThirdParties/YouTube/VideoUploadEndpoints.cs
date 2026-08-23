using System.Net;
using System.Text;
using Microsoft.AspNetCore.Http.Features;
using tusdotnet;
using tusdotnet.Interfaces;
using tusdotnet.Models;
using tusdotnet.Models.Expiration;
using tusdotnet.Stores;

namespace LearnMS.API.ThirdParties.YouTube;

public static class VideoUploadEndpoints
{
    public const long MaxLessonVideoBytes = 64L * 1024 * 1024 * 1024;

    public static bool IsLessonVideoUpload(PathString path)
    {
        var value = path.Value;
        return value is not null
            && value.StartsWith("/api/courses/", StringComparison.OrdinalIgnoreCase)
            && value.Contains("/video", StringComparison.OrdinalIgnoreCase);
    }

    public static void MapVideoUploadEndpoints(this WebApplication app)
    {
        app.MapTus("/api/courses/{courseId}/lectures/{lectureId}/lessons/{lessonId}/video", async context =>
        {
            await Task.CompletedTask;

            string courseId = context.Request.RouteValues["courseId"]?.ToString() ?? throw new ArgumentNullException();
            string lectureId = context.Request.RouteValues["lectureId"]?.ToString() ?? throw new ArgumentNullException();
            string lessonId = context.Request.RouteValues["lessonId"]?.ToString() ?? throw new ArgumentNullException();

            var env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
            var config = context.RequestServices.GetRequiredService<IConfiguration>();
            var logger = context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("LessonVideoUpload");
            var videoRoot = LessonVideoStorage.EnsureRoot(env, config);
            var tusPath = Path.Combine(videoRoot, "tus");
            var processingPath = Path.Combine(videoRoot, "processing");
            var store = new TusDiskStore(tusPath, deletePartialFilesOnConcat: true);

            var maxRequestBody = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
            if (maxRequestBody is not null)
                maxRequestBody.MaxRequestBodySize = null;

            var bodyControl = context.Features.Get<IHttpBodyControlFeature>();
            if (bodyControl is not null)
                bodyControl.AllowSynchronousIO = true;

            return new DefaultTusConfiguration
            {
                Store = store,
                MaxAllowedUploadSizeInBytesLong = MaxLessonVideoBytes,
                Expiration = new SlidingExpiration(TimeSpan.FromHours(24)),
                Events = new()
                {
                    OnBeforeCreateAsync = ctx =>
                    {
                        logger.LogInformation(
                            "Lesson video create {LessonId} size {Size} bytes",
                            lessonId,
                            ctx.UploadLength
                        );
                        if (HasInsufficientDisk(tusPath, ctx.UploadLength))
                        {
                            ctx.FailRequest(
                                HttpStatusCode.InsufficientStorage,
                                "The server does not have enough disk space for this video."
                            );
                        }
                        return Task.CompletedTask;
                    },
                    OnFileCompleteAsync = async ctx =>
                    {
                        ITusFile file = await ctx.GetFileAsync();
                        var sourcePath = Path.Combine(tusPath, file.Id);
                        var destPath = Path.Combine(processingPath, $"{lessonId}-{Guid.NewGuid():N}");

                        if (!File.Exists(sourcePath))
                            throw new InvalidOperationException("Uploaded video was not found on disk.");

                        File.Move(sourcePath, destPath, overwrite: true);

                        try
                        {
                            var terminationStore = (ITusTerminationStore)ctx.Store;
                            await terminationStore.DeleteFileAsync(file.Id, CancellationToken.None);
                        }
                        catch
                        {
                            // Content was already moved; leftover TUS metadata is best-effort.
                        }

                        var queue = ctx.HttpContext.RequestServices.GetRequiredService<LessonVideoUploadQueue>();
                        await queue.EnqueueAsync(new LessonVideoUploadJob
                        {
                            CourseId = Guid.Parse(courseId),
                            LectureId = Guid.Parse(lectureId),
                            LessonId = Guid.Parse(lessonId),
                            FilePath = destPath
                        });
                        logger.LogInformation("Queued lesson video {LessonId} for publishing", lessonId);
                    }
                }
            };
        }).AllowAnonymous();

        app.MapGet("/api/video/play", (HttpContext http, string? t, YouTubeService youtube) =>
        {
            http.Response.Headers.Append("Content-Security-Policy", "frame-ancestors 'self'");
            http.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
            http.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            http.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            http.Response.Headers.Append("Cache-Control", "no-store");

            if (!youtube.TryResolvePlaybackToken(t, out var videoId))
            {
                return Results.Text(YouTubePlayerHtml.Unavailable(), "text/html; charset=utf-8", Encoding.UTF8, StatusCodes.Status403Forbidden);
            }

            return Results.Text(YouTubePlayerHtml.Build(videoId), "text/html; charset=utf-8");
        }).AllowAnonymous();
    }

    private static bool HasInsufficientDisk(string path, long? uploadLength)
    {
        if (uploadLength is null or <= 0)
            return false;

        try
        {
            var root = Path.GetPathRoot(Path.GetFullPath(path));
            if (string.IsNullOrWhiteSpace(root))
                return false;

            var drive = new DriveInfo(root);
            const long reserveBytes = 512L * 1024 * 1024;
            return drive.AvailableFreeSpace < uploadLength.Value + reserveBytes;
        }
        catch
        {
            return false;
        }
    }
}
