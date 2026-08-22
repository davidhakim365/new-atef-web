using LearnMS.API.Features.PaymentRequests.Contracts;

namespace LearnMS.API.Features.PaymentRequests;

public interface IPaymentRequestsService
{
    Task<PaymentRequestItem> ExecuteAsync(CreatePaymentRequestCommand command);
    Task ExecuteAsync(ReviewPaymentRequestCommand command);
    Task<PageList<PaymentRequestItem>> QueryAsync(GetPaymentRequestsQuery query);
}
