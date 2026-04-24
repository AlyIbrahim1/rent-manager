import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { api } from "@/shared/api/client";

type Props = {
  renterId: string;
};

function formatMonth(monthPaid: string) {
  const date = new Date(`${monthPaid}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return monthPaid;
  }

  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export function PaymentHistoryList({ renterId }: Props) {
  const paymentsQuery = useQuery({
    queryKey: ["payments", renterId],
    queryFn: () => api.listPayments(renterId),
  });

  if (paymentsQuery.isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#45464d", fontSize: 13 }}>
        <Loader2 size={14} className="animate-spin" />
        Loading payments...
      </div>
    );
  }

  if (paymentsQuery.isError) {
    return <p style={{ margin: 0, fontSize: 13, color: "#be123c" }}>Unable to load payment history.</p>;
  }

  const payments = paymentsQuery.data ?? [];
  if (payments.length === 0) {
    return <p style={{ margin: 0, fontSize: 13, color: "#45464d" }}>No payments recorded yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {payments.map((payment) => (
        <div
          key={payment.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f7f9fb",
            padding: "8px 12px",
            borderRadius: 4,
          }}
        >
          <span style={{ fontSize: 12, color: "#45464d" }}>{formatMonth(payment.monthPaid)}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#191c1e" }}>${payment.amountPaid.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
