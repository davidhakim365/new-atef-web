using LearnMS.API.Common;
using LearnMS.API.Entities;
using LearnMS.API.Features.PaymentRequests.Contracts;
using LearnMS.API.Security;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace LearnMS.API.Features.PaymentRequests;

[ApiController]
[Route("api/payment-requests")]
[Tags("PaymentRequests")]
public sealed class PaymentRequestsController(
    IPaymentRequestsService paymentRequestsService,
    ICurrentUserService currentUserService
) : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [ApiAuthorize(Role = UserRole.Student)]
    [SwaggerOperation(OperationId = "CreatePaymentRequest")]
    public async Task<ApiWrapper.Success<PaymentRequestItem>> Create([FromForm] CreatePaymentRequestForm request)
    {
        var currentUser = await currentUserService.GetUserAsync();

        var created = await paymentRequestsService.ExecuteAsync(new CreatePaymentRequestCommand
        {
            StudentId = currentUser!.Id,
            Amount = request.Amount,
            Note = request.Note,
            Image = request.Image
        });

        Response.StatusCode = StatusCodes.Status201Created;
        return new ApiWrapper.Success<PaymentRequestItem>
        {
            Data = created,
            Message = "Payment request submitted. It will be added to your balance after the teacher confirms it."
        };
    }

    [HttpGet("mine")]
    [ApiAuthorize(Role = UserRole.Student)]
    [SwaggerOperation(OperationId = "GetMyPaymentRequests")]
    public async Task<ApiWrapper.Success<PageList<PaymentRequestItem>>> Mine(int? page, int? pageSize)
    {
        var currentUser = await currentUserService.GetUserAsync();

        var result = await paymentRequestsService.QueryAsync(new GetPaymentRequestsQuery
        {
            Page = page,
            PageSize = pageSize,
            StudentId = currentUser!.Id
        });

        return new ApiWrapper.Success<PageList<PaymentRequestItem>>
        {
            Data = result,
            Message = "Retrieved payment requests successfully"
        };
    }

    [HttpGet]
    [ApiAuthorize(Role = UserRole.Assistant, Permissions = [Permission.ManageStudents])]
    [SwaggerOperation(OperationId = "GetPaymentRequests")]
    public async Task<ApiWrapper.Success<PageList<PaymentRequestItem>>> Get(
        int? page,
        int? pageSize,
        string? search,
        PaymentRequestStatus? status
    )
    {
        var result = await paymentRequestsService.QueryAsync(new GetPaymentRequestsQuery
        {
            Page = page,
            PageSize = pageSize,
            Search = search,
            Status = status
        });

        return new ApiWrapper.Success<PageList<PaymentRequestItem>>
        {
            Data = result,
            Message = result.Items.Count > 0 ? "Retrieved payment requests successfully" : "No payment requests found"
        };
    }

    [HttpPost("{id:guid}/confirm")]
    [ApiAuthorize(Role = UserRole.Assistant, Permissions = [Permission.ManageStudents])]
    [SwaggerOperation(OperationId = "ConfirmPaymentRequest")]
    public async Task<ApiWrapper.Success<object?>> Confirm(Guid id)
    {
        var currentUser = await currentUserService.GetUserAsync();

        await paymentRequestsService.ExecuteAsync(new ReviewPaymentRequestCommand
        {
            Id = id,
            ReviewerId = currentUser!.Id,
            AssistantId = currentUser.Role == UserRole.Assistant ? currentUser.Id : null,
            Confirm = true
        });

        return new ApiWrapper.Success<object?>
        {
            Message = "Payment confirmed. The amount was added to the student balance."
        };
    }

    [HttpPost("{id:guid}/reject")]
    [ApiAuthorize(Role = UserRole.Assistant, Permissions = [Permission.ManageStudents])]
    [SwaggerOperation(OperationId = "RejectPaymentRequest")]
    public async Task<ApiWrapper.Success<object?>> Reject(Guid id, [FromBody] RejectPaymentRequestRequest? request)
    {
        var currentUser = await currentUserService.GetUserAsync();

        await paymentRequestsService.ExecuteAsync(new ReviewPaymentRequestCommand
        {
            Id = id,
            ReviewerId = currentUser!.Id,
            AssistantId = currentUser.Role == UserRole.Assistant ? currentUser.Id : null,
            Confirm = false,
            RejectionReason = request?.Reason
        });

        return new ApiWrapper.Success<object?>
        {
            Message = "Payment request rejected"
        };
    }
}
