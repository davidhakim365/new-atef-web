using System.Text;
using LearnMS.API.Features.Courses;
using LearnMS.API.Features.Courses.Contracts;
using tusdotnet;
using tusdotnet.Interfaces;
using tusdotnet.Models;
using tusdotnet.Stores;

namespace LearnMS.API.ThirdParties.YouTube;

public static class VideoUploadEndpoints
{
    public static void MapVideoUploadEndpoints(this WebApplication app)
    {
        app.MapTus("/api/courses/{courseId}/lectures/{lectureId}/lessons/{lessonId}/video", async context =>
        {
            await Task.CompletedTask;

            string courseId = context.Request.RouteValues["courseId"]?.ToString() ?? throw new ArgumentNullException();
            string lectureId = context.Request.RouteValues["lectureId"]?.ToString() ?? throw new ArgumentNullException();
            string lessonId = context.Request.RouteValues["lessonId"]?.ToString() ?? throw new ArgumentNullException();

            var scope = context.RequestServices.CreateScope();
            var coursesService = scope.ServiceProvider.GetRequiredService<ICoursesService>();
            var tusPath = Path.Combine(Path.GetTempPath(), "lesson-videos");
            Directory.CreateDirectory(tusPath);
            var store = new TusDiskStore(tusPath, deletePartialFilesOnConcat: true);

            return new DefaultTusConfiguration
            {
                Store = store,
                MaxAllowedUploadSizeInBytes = int.MaxValue,
                Events = new()
                {
                    OnFileCompleteAsync = async ctx =>
                    {
                        ITusFile file = await ctx.GetFileAsync();
                        var fs = await file.GetContentAsync(ctx.CancellationToken);
                        try
                        {
                            await coursesService.ExecuteAsync(new UploadLessonVideoCommand
                            {
                                CourseId = Guid.Parse(courseId),
                                LectureId = Guid.Parse(lectureId),
                                FS = fs,
                                LessonId = Guid.Parse(lessonId),
                            });
                        }
                        finally
                        {
                            await fs.DisposeAsync();
                            var terminationStore = (ITusTerminationStore)ctx.Store;
                            await terminationStore.DeleteFileAsync(file.Id, ctx.CancellationToken);
                            await store.RemoveExpiredFilesAsync(ctx.CancellationToken);
                        }
                    }
                }
            };
        }).AllowAnonymous();

        app.MapGet("/api/video/play", (HttpContext http, string? t, YouTubeService youtube) =>
        {
            http.Response.Headers.Append("Content-Security-Policy", "frame-ancestors 'self'");
            http.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
            http.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            http.Response.Headers.Append("Referrer-Policy", "no-referrer");
            http.Response.Headers.Append("Cache-Control", "no-store");

            if (!youtube.TryResolvePlaybackToken(t, out var videoId))
            {
                return Results.Text(YouTubePlayerHtml.Unavailable(), "text/html; charset=utf-8", Encoding.UTF8, StatusCodes.Status403Forbidden);
            }

            return Results.Text(YouTubePlayerHtml.Build(videoId), "text/html; charset=utf-8");
        }).AllowAnonymous();
    }
}
