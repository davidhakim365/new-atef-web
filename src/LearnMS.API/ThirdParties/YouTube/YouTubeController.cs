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
        if (_youTubeService.HasEnvRefreshToken())
        {
            return new()
            {
                Data = "",
                Message = "YouTube is already connected from YouTube__RefreshToken. Reconnecting would replace that token and is not needed."
            };
        }

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

        var refreshToken = await _youTubeService.CompleteOAuthAsync(code, CallbackUrl());
        if (_youTubeService.HasEnvRefreshToken())
        {
            return Content(
                """
                <html><body style="font-family:system-ui;padding:40px;max-width:720px">
                  <h2>YouTube is already connected</h2>
                  <p>This server uses <code>YouTube__RefreshToken</code> from the environment. Leave that value as it is. Do not replace it with a new token.</p>
                </body></html>
                """,
                "text/html"
            );
        }

        var safeToken = System.Net.WebUtility.HtmlEncode(refreshToken);
        return Content(
            $"""
            <html><body style="font-family:system-ui;padding:40px;max-width:720px">
              <h2>YouTube connected</h2>
              <p>Copy this refresh token into Render as <code>YouTube__RefreshToken</code>, then save and redeploy. After that, you do not need to connect again.</p>
              <textarea readonly style="width:100%;height:120px;font-family:monospace">{safeToken}</textarea>
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
