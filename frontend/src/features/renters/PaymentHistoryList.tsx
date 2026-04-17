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
      <div className="flex items-center gap-2 text-slate-400 py-4">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-sm">Loading payments…</span>
      </div>
    );
  }

  if (paymentsQuery.isError) {
    return <p className="text-red-500 text-sm py-2">Unable to load payment history.</p>;
  }

  const payments = paymentsQuery.data ?? [];

  if (payments.length === 0) {
    return <p className="text-slate-400 text-sm py-2 italic">No payments recorded yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {payments.map((payment) => (
        <li key={payment.id} className="flex items-center justify-between py-3">
          <span className="mono text-sm text-slate-600">{payment.monthPaid}</span>
          <span className="mono text-sm font-semibold text-green-600">${payment.amountPaid.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}
