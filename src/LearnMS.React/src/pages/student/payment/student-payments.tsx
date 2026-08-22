import Footer from "@/components/footer";
import Loading from "@/components/loading/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePaymentRequestMutation,
  useMyPaymentRequestsQuery,
} from "@/api/payment-requests-api";
import { useGetProfile, useRedeemCreditCode } from "@/generated/api";
import { toast } from "@/lib/utils";
import { PaymentRequestItem } from "@/types/payment-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { z } from "zod";

const RedeemRequest = z.object({
  code: z.string().min(1, { message: "Code is required" }),
});

type RedeemRequest = z.infer<typeof RedeemRequest>;

const PaymentRequestForm = z.object({
  amount: z.coerce.number().min(1, { message: "Amount must be at least 1" }),
  note: z.string().max(500).optional(),
  image: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Transfer image is required",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, "Image must be under 10 MB"),
});

type PaymentRequestForm = z.infer<typeof PaymentRequestForm>;

const StudentPayments = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading, refetch } = useGetProfile();
  const requestsQuery = useMyPaymentRequestsQuery();
  const createRequest = useCreatePaymentRequestMutation();
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: redeem, isPending } = useRedeemCreditCode({
    mutation: {
      throwOnError: false,
      onSuccess: (data) => {
        toast({
          title: t("redeem.success.title"),
          description: t("redeem.success.description", {
            value: data.data?.value,
            currency: t("common.currency"),
          }),
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: t("redeem.error.title"),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const redeemForm = useForm({
    resolver: zodResolver(RedeemRequest),
    values: {
      code: "",
    },
  });

  const requestForm = useForm<PaymentRequestForm>({
    resolver: zodResolver(PaymentRequestForm),
    defaultValues: {
      amount: undefined as unknown as number,
      note: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  if (!profile?.data) {
    return (
      <Navigate to="/sign-in-sign-up" state={{ from: "/payment" }} replace />
    );
  }

  const credits =
    profile.data.$type === "GetStudentProfileResult" ? profile.data.credits : 0;

  const onRedeem = (data: RedeemRequest) => {
    redeem({
      params: {
        code: data.code,
      },
    });
  };

  const onRequest = (data: PaymentRequestForm) => {
    const formData = new FormData();
    formData.append("amount", String(data.amount));
    if (data.note) formData.append("note", data.note);
    formData.append("image", data.image);

    createRequest.mutate(formData, {
      onSuccess: () => {
        toast({
          title: t("payments.request.successTitle"),
          description: t("payments.request.successDescription"),
        });
        requestForm.reset({
          amount: undefined as unknown as number,
          note: "",
          image: undefined as unknown as File,
        });
        setPreview(null);
      },
    });
  };

  const requests = requestsQuery.data?.data?.items ?? [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-paymentPage">
      <div className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("payments.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("payments.subtitle")}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 px-4 py-2 text-right dark:bg-indigo-950/50">
              <p className="text-xs text-muted-foreground">{t("payments.balance")}</p>
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                {credits} {t("common.currency")}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-lg bg-card/95">
              <CardHeader>
                <CardTitle>{t("payments.request.title")}</CardTitle>
                <CardDescription>{t("payments.request.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...requestForm}>
                  <form
                    className="space-y-4"
                    onSubmit={requestForm.handleSubmit(onRequest)}
                  >
                    <FormField
                      control={requestForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("payments.amount")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requestForm.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("payments.request.note")}</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder={t("payments.request.notePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={requestForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("payments.request.image")}</FormLabel>
                          <FormControl>
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 p-6 text-sm text-muted-foreground transition hover:border-indigo-400 dark:border-indigo-800 dark:bg-indigo-950/30">
                              {preview ? (
                                <img
                                  src={preview}
                                  alt="Transfer preview"
                                  className="max-h-48 rounded-lg object-contain"
                                />
                              ) : (
                                <>
                                  <ImagePlus className="h-8 w-8 text-indigo-500" />
                                  <span>{t("payments.request.imageHint")}</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  field.onChange(file);
                                  if (preview) URL.revokeObjectURL(preview);
                                  setPreview(file ? URL.createObjectURL(file) : null);
                                }}
                              />
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={createRequest.isPending}
                    >
                      <Wallet className="h-4 w-4" />
                      {createRequest.isPending
                        ? t("payments.request.submitting")
                        : t("payments.request.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/95">
              <CardHeader className="text-center">
                <CardTitle>{t("redeem.title")}</CardTitle>
                <CardDescription>{t("redeem.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...redeemForm}>
                  <form
                    className="space-y-4"
                    onSubmit={redeemForm.handleSubmit(onRedeem)}
                  >
                    <FormField
                      control={redeemForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-12 font-mono text-lg tracking-widest text-center"
                              placeholder={t("redeem.placeholder")}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-12"
                    >
                      {isPending ? t("redeem.submitting") : t("redeem.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg bg-card/95">
            <CardHeader>
              <CardTitle>{t("payments.requestsTitle")}</CardTitle>
              <CardDescription>{t("payments.requestsSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requestsQuery.isLoading ? (
                <Loading />
              ) : requests.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  {t("payments.noPaymentsDescription")}
                </p>
              ) : (
                requests.map((request) => (
                  <StudentRequestRow key={request.id} request={request} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function StudentRequestRow({ request }: { request: PaymentRequestItem }) {
  const { t } = useTranslation();
  const statusClass =
    request.status === "Confirmed"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
      : request.status === "Rejected"
        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center">
      <a href={request.imageUrl} target="_blank" rel="noreferrer" className="shrink-0">
        <img
          src={request.imageThumbUrl || request.imageUrl}
          alt="Transfer"
          className="h-20 w-20 rounded-lg object-cover"
        />
      </a>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {request.amount} {t("common.currency")}
          </p>
          <Badge className={statusClass}>{t(`payments.status.${request.status.toLowerCase()}`)}</Badge>
        </div>
        {request.note && (
          <p className="text-sm text-muted-foreground">{request.note}</p>
        )}
        {request.rejectionReason && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {request.rejectionReason}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {new Date(request.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default StudentPayments;
