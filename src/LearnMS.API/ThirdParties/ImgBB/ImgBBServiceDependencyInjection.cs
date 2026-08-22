namespace LearnMS.API.ThirdParties.ImgBB;

public static class ImgBBServiceDependencyInjection
{
    public static IServiceCollection RegisterImgBBService(this IServiceCollection services, IConfiguration cfg)
    {
        services.Configure<ImgBBConfig>(cfg.GetSection(ImgBBConfig.Section));
        services.AddHttpClient("ImgBB", client =>
        {
            client.Timeout = TimeSpan.FromMinutes(2);
        });
        services.AddScoped<ImgBBService>();
        return services;
    }
}
