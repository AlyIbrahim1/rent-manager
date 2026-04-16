import type { Renter } from "../../api/types";
import { PaymentHistoryList } from "./PaymentHistoryList";

type Props = {
  renter: Renter | null;
};

export function RenterDetailsPanel({ renter }: Props) {
  if (!renter) {
    return <section>Select a renter to view details.</section>;
  }

  return (
    <section>
      <h2>{renter.name}</h2>
      <p>Apt #{renter.appartmentNumber}</p>
      <p>Last paid: {renter.lastMonthPayed ?? "N/A"}</p>
      <PaymentHistoryList renterId={renter.id} />
    </section>
  );
}
