import Confirmation from "@/components/confirmation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentRequestItem } from "@/types/payment-request";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function StatusBadge({ status }: { status: PaymentRequestItem["status"] }) {
  const className =
    status === "Confirmed"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
      : status === "Rejected"
        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";

  return <Badge className={className}>{status}</Badge>;
}

function TransferImage({ url, thumb }: { url: string; thumb?: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        <img
          src={thumb || url}
          alt="Transfer"
          className="h-14 w-14 rounded-lg object-cover"
        />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transfer image</DialogTitle>
          </DialogHeader>
          <img src={url} alt="Transfer" className="max-h-[70vh] w-full rounded-lg object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function paymentRequestsColumns({
  onConfirm,
  onReject,
  confirmingId,
  rejectingId,
}: {
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  confirmingId?: string;
  rejectingId?: string;
}): ColumnDef<PaymentRequestItem>[] {
  return [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <div className="text-left">
          <Link
            className="font-medium underline-offset-2 hover:underline"
            to={`/dashboard/students/${row.original.studentId}`}
          >
            {row.original.studentName}
          </Link>
          <div className="text-xs text-muted-foreground">{row.original.studentEmail}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.studentPhone} · {row.original.studentCode}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.amount} LE</span>
      ),
    },
    {
      id: "image",
      header: "Transfer",
      cell: ({ row }) => (
        <TransferImage
          url={row.original.imageUrl}
          thumb={row.original.imageThumbUrl}
        />
      ),
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <span className="max-w-[180px] truncate block">
          {row.original.note || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="space-y-1">
          <StatusBadge status={row.original.status} />
          {row.original.rejectionReason && (
            <div className="text-xs text-rose-600 dark:text-rose-400">
              {row.original.rejectionReason}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (row.original.status !== "Pending") return null;
        return (
          <div className="flex items-center justify-center gap-2">
            <Confirmation
              title="Confirm payment?"
              description={`Add ${row.original.amount} LE to ${row.original.studentName}'s balance.`}
              onConfirm={() => onConfirm(row.original.id)}
              disabled={confirmingId === row.original.id}
              button={
                <Button size="sm" disabled={confirmingId === row.original.id}>
                  <Check className="h-4 w-4" />
                  Confirm
                </Button>
              }
            />
            <Confirmation
              title="Reject this request?"
              description="The student will see this as rejected. Balance will not change."
              onConfirm={() => onReject(row.original.id)}
              disabled={rejectingId === row.original.id}
              button={
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={rejectingId === row.original.id}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];
}
