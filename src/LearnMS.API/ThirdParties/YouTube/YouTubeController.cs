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
    public ApiWrapper.Success<object> Status()
    {
        return new()
        {
            Data = new { connected = _youTubeService.IsConfigured() },
            Message = _youTubeService.IsConfigured() ? "YouTube is connected" : "YouTube is not connected"
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
            "<html><body style='font-family:system-ui;padding:40px'><h2>YouTube connected.</h2><p>You can close this tab and go back to the dashboard.</p></body></html>",
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
