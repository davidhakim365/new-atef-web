using System.ComponentModel.DataAnnotations;
using LearnMS.API.Entities;

namespace LearnMS.API.Features.PaymentRequests.Contracts;

public sealed class CreatePaymentRequestForm
{
    [Required]
    [Range(1, 100000)]
    public decimal Amount { get; set; }

    [MaxLength(500)]
    public string? Note { get; set; }

    [Required]
    public IFormFile Image { get; set; } = null!;
}

public sealed record CreatePaymentRequestCommand
{
    public required Guid StudentId { get; init; }
    public required decimal Amount { get; init; }
    public string? Note { get; init; }
    public required IFormFile Image { get; init; }
}

public sealed record GetPaymentRequestsQuery
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
    public PaymentRequestStatus? Status { get; init; }
    public Guid? StudentId { get; init; }
}

public sealed record ReviewPaymentRequestCommand
{
    public required Guid Id { get; init; }
    public required Guid ReviewerId { get; init; }
    public Guid? AssistantId { get; init; }
    public required bool Confirm { get; init; }
    public string? RejectionReason { get; init; }
}

public sealed record RejectPaymentRequestRequest
{
    [MaxLength(500)]
    public string? Reason { get; init; }
}

public sealed record PaymentRequestItem
{
    [Required] public required Guid Id { get; init; }
    [Required] public required decimal Amount { get; init; }
    [Required] public required string ImageUrl { get; init; }
    public string? ImageThumbUrl { get; init; }
    public string? Note { get; init; }
    [Required] public required PaymentRequestStatus Status { get; init; }
    public string? RejectionReason { get; init; }
    [Required] public required DateTime CreatedAt { get; init; }
    public DateTime? ReviewedAt { get; init; }
    [Required] public required Guid StudentId { get; init; }
    [Required] public required string StudentName { get; init; }
    [Required] public required string StudentEmail { get; init; }
    [Required] public required string StudentPhone { get; init; }
    [Required] public required string StudentCode { get; init; }
}
