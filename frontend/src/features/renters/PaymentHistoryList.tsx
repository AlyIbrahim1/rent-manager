import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "../../api/client";

type Props = {
  renterId: string;
};

export function PaymentHistoryList({ renterId }: Props) {
  const paymentsQuery = useQuery({
    queryKey: ["payments", renterId],
    queryFn: () => api.listPayments(renterId),
  });

  if (paymentsQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-on-surface-muted">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-sm">Loading payments…</span>
      </div>
    );
  }

  if (paymentsQuery.isError) {
    return <p className="py-2 text-sm text-[#be123c]">Unable to load payment history.</p>;
  }

  const payments = paymentsQuery.data ?? [];

  if (payments.length === 0) {
    return <p className="py-2 text-sm italic text-on-surface-muted">No payments recorded yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {payments.map((payment) => (
        <li key={payment.id} className="flex items-center justify-between rounded-sm bg-surface-container-low px-3 py-3">
          <span className="text-sm text-on-surface-muted">{payment.monthPaid}</span>
          <span className="text-sm font-semibold text-[#059669]">${payment.amountPaid.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}
