using LearnMS.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearnMS.API.Data.Configurations;

public sealed class PaymentRequestsConfigurations : IEntityTypeConfiguration<PaymentRequest>
{
    public void Configure(EntityTypeBuilder<PaymentRequest> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.ImageUrl).IsRequired().HasMaxLength(2048);
        builder.Property(x => x.ImageThumbUrl).HasMaxLength(2048);
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.Property(x => x.RejectionReason).HasMaxLength(500);

        builder.Property(x => x.Status)
            .HasConversion(x => x.ToString(), x => (PaymentRequestStatus)Enum.Parse(typeof(PaymentRequestStatus), x));

        builder.HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.StudentId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.CreatedAt);
    }
}
