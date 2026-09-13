using LearnMS.API.Common;
using LearnMS.API.Entities;
using LearnMS.API.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearnMS.API.ThirdParties.YouTube;

[Route("api/youtube")]
[Tags("YouTube")]
[ApiController]
public sealed class YouTubeController : ControllerBase
{
    private readonly YouTubeService _youTubeService;

    public YouTubeController(YouTubeService youTubeService)
    {
        _youTubeService = youTubeService;
    }

    [HttpGet("status")]
    [ApiAuthorize(Role = UserRole.Assistant, Permissions = [Permission.ManageCourses])]
    public async Task<ApiWrapper.Success<object>> Status()
    {
        var status = await _youTubeService.GetConnectionStatusAsync();
        return new()
        {
            Data = new { connected = status.Connected },
            Message = status.Message
        };
    }

    [HttpGet("connect")]
    [ApiAuthorize(Role = UserRole.Teacher)]
    public ApiWrapper.Success<string> Connect()
    {
        return new()
        {
            Data = _youTubeService.GetAuthorizationUrl(CallbackUrl()),
            Message = "Open this URL to connect YouTube"
        };
    }

    [HttpGet("callback")]
    [AllowAnonymous]
    public async Task<IActionResult> Callback([FromQuery] string? code, [FromQuery] string? error)
    {
        if (!string.IsNullOrWhiteSpace(error) || string.IsNullOrWhiteSpace(code))
        {
            return Content(
                "<html><body style='font-family:system-ui;padding:40px'><h2>YouTube connection cancelled.</h2></body></html>",
                "text/html"
            );
        }

        await _youTubeService.CompleteOAuthAsync(code, CallbackUrl());
        return Content(
            """
            <html><body style="font-family:system-ui;padding:40px;max-width:720px">
              <h2>YouTube connected</h2>
              <p>The refresh token was saved on the server. You can close this tab and upload lesson videos. You do not need to paste the token into Render after every connect.</p>
              <p>In Google Cloud, set the OAuth consent screen to <b>In production</b>. If it stays in Testing, Google expires the token about every 7 days and you will have to connect again.</p>
            </body></html>
            """,
            "text/html"
        );
    }

    private string CallbackUrl()
    {
        var configured = HttpContext.RequestServices
            .GetRequiredService<Microsoft.Extensions.Options.IOptions<YouTubeConfig>>()
            .Value.RedirectUri;

        if (!string.IsNullOrWhiteSpace(configured) && configured != "*")
            return configured;

        return $"{Request.Scheme}://{Request.Host}/api/youtube/callback";
    }
}
