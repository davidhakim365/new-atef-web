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

    public static void MapVideoUploadEndpoints(this WebApplication app)
    {
        app.MapTus("/api/courses/{courseId}/lectures/{lectureId}/lessons/{lessonId}/video", async context =>
        {
            await Task.CompletedTask;

            string courseId = context.Request.RouteValues["courseId"]?.ToString() ?? throw new ArgumentNullException();
            string lectureId = context.Request.RouteValues["lectureId"]?.ToString() ?? throw new ArgumentNullException();
            string lessonId = context.Request.RouteValues["lessonId"]?.ToString() ?? throw new ArgumentNullException();

            var videoRoot = Path.Combine(Path.GetTempPath(), "lesson-videos");
            var tusPath = Path.Combine(videoRoot, "tus");
            var processingPath = Path.Combine(videoRoot, "processing");
            Directory.CreateDirectory(tusPath);
            Directory.CreateDirectory(processingPath);
            var store = new TusDiskStore(tusPath, deletePartialFilesOnConcat: true);

            var maxRequestBody = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
            if (maxRequestBody is not null)
                maxRequestBody.MaxRequestBodySize = null;

            return new DefaultTusConfiguration
            {
                Store = store,
                MaxAllowedUploadSizeInBytesLong = MaxLessonVideoBytes,
                Expiration = new SlidingExpiration(TimeSpan.FromHours(24)),
                Events = new()
                {
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
}
