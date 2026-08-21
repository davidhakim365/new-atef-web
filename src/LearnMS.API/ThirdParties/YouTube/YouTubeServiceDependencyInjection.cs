namespace LearnMS.API.ThirdParties.YouTube;

public static class YouTubeServiceDependencyInjection
{
    public static IServiceCollection RegisterYouTubeService(this IServiceCollection services, IConfiguration cfg)
    {
        services.Configure<YouTubeConfig>(cfg.GetSection(YouTubeConfig.Section));
        services.AddHttpClient("YouTubeApi", client =>
        {
            client.Timeout = TimeSpan.FromHours(2);
        });
        services.AddSingleton<YouTubeService>();
        return services;
    }
}
