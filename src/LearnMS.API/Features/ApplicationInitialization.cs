using LearnMS.API.Common;
using LearnMS.API.Data;
using LearnMS.API.Features.Administration;
using LearnMS.API.Features.Administration.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace LearnMS.API.Features;

public static class ApplicationInitialization
{
    public static async Task InitializeAsync(this WebApplication app)
    {
        var scope = app.Services.CreateAsyncScope();

        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await EnsurePaymentRequestsTableAsync(db);

        var administrationService = scope.ServiceProvider.GetRequiredService<IAdministrationService>();
        var administrationConfig = scope.ServiceProvider.GetRequiredService<IOptions<AdministrationConfig>>();


        foreach (var teacher in administrationConfig.Value.Teachers ?? [])
        {
            try
            {
                await administrationService.ExecuteAsync(new CreateTeacherCommand
                {
                    Email = teacher.Email,
                    Password = teacher.Password
                });
                Console.WriteLine($"Teacher {teacher.Email} created");
            }
            catch (ApiException ex)
            {
                if (ex.Error == AdministrationErrors.EmailAlreadyRegistered)
                    Console.WriteLine($"Teacher {teacher.Email} already exists");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        foreach (var assistant in administrationConfig.Value.Assistants ?? [])
        {
            try
            {
                await administrationService.ExecuteAsync(new CreateAssistantCommand
                {
                    Email = assistant.Email,
                    Password = assistant.Password
                });
                Console.WriteLine($"Assistant {assistant.Email} created");
            }
            catch (ApiException ex)
            {
                if (ex.Error == AdministrationErrors.EmailAlreadyRegistered)
                    Console.WriteLine($"Assistant {assistant.Email} already exists");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }

    private static async Task EnsurePaymentRequestsTableAsync(AppDbContext db)
    {
        try
        {
            await db.Database.ExecuteSqlRawAsync(
                """
                CREATE TABLE IF NOT EXISTS "PaymentRequests" (
                    "Id" uuid NOT NULL,
                    "StudentId" uuid NOT NULL,
                    "Amount" numeric(18,2) NOT NULL,
                    "ImageUrl" character varying(2048) NOT NULL,
                    "ImageThumbUrl" character varying(2048) NULL,
                    "Note" character varying(500) NULL,
                    "Status" text NOT NULL,
                    "ReviewedById" uuid NULL,
                    "RejectionReason" character varying(500) NULL,
                    "CreatedAt" timestamp with time zone NOT NULL,
                    "ReviewedAt" timestamp with time zone NULL,
                    CONSTRAINT "PK_PaymentRequests" PRIMARY KEY ("Id")
                )
                """
            );
            await db.Database.ExecuteSqlRawAsync(
                """CREATE INDEX IF NOT EXISTS "IX_PaymentRequests_CreatedAt" ON "PaymentRequests" ("CreatedAt")"""
            );
            await db.Database.ExecuteSqlRawAsync(
                """CREATE INDEX IF NOT EXISTS "IX_PaymentRequests_Status" ON "PaymentRequests" ("Status")"""
            );
            await db.Database.ExecuteSqlRawAsync(
                """CREATE INDEX IF NOT EXISTS "IX_PaymentRequests_StudentId" ON "PaymentRequests" ("StudentId")"""
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Could not ensure PaymentRequests table: {ex.Message}");
        }
    }
}