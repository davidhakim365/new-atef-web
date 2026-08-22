import { ApiResponse, api } from "@/api";
import { PageList } from "@/types/page-list";
import { PaymentRequestItem, PaymentRequestStatus } from "@/types/payment-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKey = ["payment-requests"];

export const usePaymentRequestsQuery = ({
  page,
  pageSize,
  search,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: PaymentRequestStatus | "all";
}) => {
  return useQuery<ApiResponse<PageList<PaymentRequestItem>>>({
    queryKey: [...queryKey, { page, pageSize, search, status }],
    queryFn: () =>
      api
        .get("/api/payment-requests", {
          params: {
            page,
            pageSize,
            search: search || undefined,
            status: status && status !== "all" ? status : undefined,
          },
        })
        .then((res) => res.data),
  });
};

export const useMyPaymentRequestsQuery = () => {
  return useQuery<ApiResponse<PageList<PaymentRequestItem>>>({
    queryKey: [...queryKey, "mine"],
    queryFn: () =>
      api
        .get("/api/payment-requests/mine", {
          params: { page: 1, pageSize: 50 },
        })
        .then((res) => res.data),
  });
};

export const useCreatePaymentRequestMutation = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<PaymentRequestItem>, unknown, FormData>({
    mutationFn: (data) =>
      api.post("/api/payment-requests", data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
};

export const useConfirmPaymentRequestMutation = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<unknown>, unknown, string>({
    mutationFn: (id) =>
      api.post(`/api/payment-requests/${id}/confirm`).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
};

export const useRejectPaymentRequestMutation = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<unknown>,
    unknown,
    { id: string; reason?: string }
  >({
    mutationFn: ({ id, reason }) =>
      api
        .post(`/api/payment-requests/${id}/reject`, { reason })
        .then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
};
