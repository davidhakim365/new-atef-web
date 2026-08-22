using LearnMS.API.Common;
using LearnMS.API.Data;
using LearnMS.API.Entities;
using LearnMS.API.Features.PaymentRequests.Contracts;
using LearnMS.API.Features.Students;
using LearnMS.API.ThirdParties.ImgBB;
using Microsoft.EntityFrameworkCore;

namespace LearnMS.API.Features.PaymentRequests;

public sealed class PaymentRequestsService(
    AppDbContext db,
    ImgBBService imgBBService
) : IPaymentRequestsService
{
    public async Task<PaymentRequestItem> ExecuteAsync(CreatePaymentRequestCommand command)
    {
        if (command.Amount <= 0)
            throw new ApiException(PaymentRequestsErrors.InvalidAmount);

        var student = await db.Students.FirstOrDefaultAsync(x => x.Id == command.StudentId);

        if (student is null)
            throw new ApiException(StudentsErrors.NotFound);

        var (url, thumb) = await imgBBService.UploadAsync(command.Image);

        var request = new PaymentRequest
        {
            StudentId = student.Id,
            Amount = command.Amount,
            Note = string.IsNullOrWhiteSpace(command.Note) ? null : command.Note.Trim(),
            ImageUrl = url,
            ImageThumbUrl = thumb
        };

        await db.PaymentRequests.AddAsync(request);
        await db.SaveChangesAsync();

        var email = await db.Accounts
            .Where(x => x.Id == student.Id)
            .Select(x => x.Email)
            .FirstOrDefaultAsync() ?? "";

        return Map(request, student, email);
    }

    public async Task ExecuteAsync(ReviewPaymentRequestCommand command)
    {
        var request = await db.PaymentRequests
            .Include(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == command.Id);

        if (request is null)
            throw new ApiException(PaymentRequestsErrors.NotFound);

        if (request.Status != PaymentRequestStatus.Pending)
            throw new ApiException(PaymentRequestsErrors.AlreadyReviewed);

        request.ReviewedById = command.ReviewerId;
        request.ReviewedAt = DateTime.UtcNow;

        if (command.Confirm)
        {
            request.Status = PaymentRequestStatus.Confirmed;
            request.Student.AddCredit(command.AssistantId, request.Amount, out var studentCredit);
            await db.AddAsync(studentCredit);
            db.Update(request.Student);
        }
        else
        {
            request.Status = PaymentRequestStatus.Rejected;
            request.RejectionReason = string.IsNullOrWhiteSpace(command.RejectionReason)
                ? null
                : command.RejectionReason.Trim();
        }

        db.Update(request);
        await db.SaveChangesAsync();
    }

    public async Task<PageList<PaymentRequestItem>> QueryAsync(GetPaymentRequestsQuery query)
    {
        var page = query.Page is null or < 1 ? 1 : query.Page.Value;
        var pageSize = query.PageSize is null or < 1 ? 10 : Math.Min(query.PageSize.Value, 100);
        var search = query.Search?.Trim().ToLowerInvariant();

        var source = db.PaymentRequests.AsNoTracking()
            .Join(
                db.Students.AsNoTracking(),
                pr => pr.StudentId,
                s => s.Id,
                (pr, s) => new { pr, s }
            )
            .Select(x => new
            {
                x.pr,
                x.s,
                Email = db.Accounts
                    .Where(a => a.Id == x.s.Id)
                    .Select(a => a.Email)
                    .FirstOrDefault() ?? ""
            });

        if (query.StudentId is not null)
            source = source.Where(x => x.pr.StudentId == query.StudentId);

        if (query.Status is not null)
            source = source.Where(x => x.pr.Status == query.Status);

        if (!string.IsNullOrWhiteSpace(search))
        {
            source = source.Where(x =>
                x.s.FullName.ToLower().Contains(search) ||
                x.Email.ToLower().Contains(search) ||
                x.s.PhoneNumber.Contains(search) ||
                x.s.StudentCode.ToLower().Contains(search)
            );
        }

        var ordered = source.OrderByDescending(x => x.pr.CreatedAt);

        var totalCount = await ordered.CountAsync();
        var rows = await ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = rows.Select(x => Map(x.pr, x.s, x.Email)).ToList();

        return new PageList<PaymentRequestItem>(items, page, pageSize, totalCount);
    }

    private static PaymentRequestItem Map(PaymentRequest request, Student student, string email) => new()
    {
        Id = request.Id,
        Amount = request.Amount,
        ImageUrl = request.ImageUrl,
        ImageThumbUrl = request.ImageThumbUrl,
        Note = request.Note,
        Status = request.Status,
        RejectionReason = request.RejectionReason,
        CreatedAt = request.CreatedAt,
        ReviewedAt = request.ReviewedAt,
        StudentId = student.Id,
        StudentName = student.FullName,
        StudentEmail = email,
        StudentPhone = student.PhoneNumber,
        StudentCode = student.StudentCode
    };
}
