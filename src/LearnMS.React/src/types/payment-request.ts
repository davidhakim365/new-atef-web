export type PaymentRequestStatus = "Pending" | "Confirmed" | "Rejected";

export type PaymentRequestItem = {
  id: string;
  amount: number;
  imageUrl: string;
  imageThumbUrl?: string | null;
  note?: string | null;
  status: PaymentRequestStatus;
  rejectionReason?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentCode: string;
};
