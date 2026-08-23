namespace LearnMS.API.ThirdParties.YouTube;

internal static class LessonVideoStorage
{
    public static string GetRoot(IWebHostEnvironment env, IConfiguration? config = null)
    {
        var configured = config?["Storage:LessonVideosDirectory"]
            ?? Environment.GetEnvironmentVariable("Storage__LessonVideosDirectory");
        if (!string.IsNullOrWhiteSpace(configured))
            return configured;

        foreach (var candidate in new[] { "/data/lesson-videos", "/var/data/lesson-videos" })
        {
            var parent = Path.GetDirectoryName(candidate);
            if (parent is not null && Directory.Exists(parent))
                return candidate;
        }

        return Path.Combine(env.ContentRootPath, "data", "lesson-videos");
    }

    public static string EnsureRoot(IWebHostEnvironment env, IConfiguration? config = null)
    {
        var root = GetRoot(env, config);
        Directory.CreateDirectory(Path.Combine(root, "tus"));
        Directory.CreateDirectory(Path.Combine(root, "processing"));
        Directory.CreateDirectory(Path.Combine(root, "scratch"));
        return root;
    }

    public static string CreateScratchFile(IWebHostEnvironment env, IConfiguration? config = null)
    {
        var root = EnsureRoot(env, config);
        return Path.Combine(root, "scratch", $"lesson-{Guid.NewGuid():N}.bin");
    }
}
