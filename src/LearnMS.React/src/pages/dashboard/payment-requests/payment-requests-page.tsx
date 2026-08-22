import {
  useConfirmPaymentRequestMutation,
  usePaymentRequestsQuery,
  useRejectPaymentRequestMutation,
} from "@/api/payment-requests-api";
import { DataTable } from "@/components/data-table";
import Loading from "@/components/loading/loading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { paymentRequestsColumns } from "@/pages/dashboard/payment-requests/columns";
import { PaymentRequestStatus } from "@/types/payment-request";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

const PaymentRequestsPage = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentRequestStatus | "all">("Pending");

  const query = usePaymentRequestsQuery({
    page: pageIndex + 1,
    pageSize,
    search,
    status,
  });

  const confirmMutation = useConfirmPaymentRequestMutation();
  const rejectMutation = useRejectPaymentRequestMutation();

  const columns = useMemo(
    () =>
      paymentRequestsColumns({
        onConfirm: (id) =>
          confirmMutation.mutate(id, {
            onSuccess: (res) => {
              toast({
                title: "Payment confirmed",
                description: res.message,
              });
            },
          }),
        onReject: (id) =>
          rejectMutation.mutate(
            { id },
            {
              onSuccess: (res) => {
                toast({
                  title: "Payment rejected",
                  description: res.message,
                });
              },
            }
          ),
        confirmingId: confirmMutation.isPending
          ? confirmMutation.variables
          : undefined,
        rejectingId: rejectMutation.isPending
          ? rejectMutation.variables?.id
          : undefined,
      }),
    [confirmMutation, rejectMutation]
  );

  return (
    <div className="flex flex-col w-full gap-4 p-4 text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Payment Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Review student transfer images, then confirm to add the amount to their balance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="w-56"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as PaymentRequestStatus | "all");
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {query.isLoading || !query.data?.data ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={query.data.data.items}
          pagination={{
            pageIndex,
            pageSize,
            pageCount: query.data.data.totalCount,
            hasNextPage: query.data.data.hasNextPage,
            hasPreviousPage: query.data.data.hasPreviousPage,
          }}
          rowCount={query.data.data.totalCount}
          setPagination={setPagination}
        />
      )}
    </div>
  );
};

export default PaymentRequestsPage;
