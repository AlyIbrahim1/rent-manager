import { useQuery } from "@tanstack/react-query";

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
    return <p>Loading payments...</p>;
  }

  if (paymentsQuery.isError) {
    return <p>Unable to load payments.</p>;
  }

  return (
    <ul>
      {(paymentsQuery.data ?? []).map((payment) => (
        <li key={payment.id}>
          {payment.monthPaid} - ${payment.amountPaid}
        </li>
      ))}
    </ul>
  );
}
