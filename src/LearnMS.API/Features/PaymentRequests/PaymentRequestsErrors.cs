using LearnMS.API.Common;

namespace LearnMS.API.Features.PaymentRequests;

public static class PaymentRequestsErrors
{
    public static readonly ApiError NotFound = new(
        "payment-request/not-found",
        "Payment request not found.",
        StatusCodes.Status404NotFound
    );

    public static readonly ApiError AlreadyReviewed = new(
        "payment-request/already-reviewed",
        "This payment request has already been reviewed.",
        StatusCodes.Status400BadRequest
    );

    public static readonly ApiError InvalidAmount = new(
        "payment-request/invalid-amount",
        "Amount must be greater than 0.",
        StatusCodes.Status400BadRequest
    );
}
