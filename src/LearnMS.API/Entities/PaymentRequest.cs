using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace LearnMS.API.Entities;

[JsonConverter(typeof(StringEnumConverter))]
public enum PaymentRequestStatus
{
    Pending,
    Confirmed,
    Rejected
}

public class PaymentRequest
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid StudentId { get; init; }
    public Student Student { get; set; } = null!;
    public decimal Amount { get; init; }
    public required string ImageUrl { get; init; }
    public string? ImageThumbUrl { get; init; }
    public string? Note { get; init; }
    public PaymentRequestStatus Status { get; set; } = PaymentRequestStatus.Pending;
    public Guid? ReviewedById { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
}
