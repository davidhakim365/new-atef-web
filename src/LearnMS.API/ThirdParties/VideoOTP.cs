namespace LearnMS.API.ThirdParties;

public sealed record VideoOTP
{
    public string Otp { get; set; } = default!;
    public string PlaybackInfo { get; set; } = default!;
}
