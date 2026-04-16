import { useState } from "react";

import { api } from "../../api/client";

type Props = {
  renterId: string;
  renterName: string;
  appartmentNumber: number;
  onComplete: () => void;
};

export function MarkPaidModal({ renterId, renterName, appartmentNumber, onComplete }: Props) {
  const [monthPaid, setMonthPaid] = useState("2026-02");
  const [amountPaid, setAmountPaid] = useState(1200);
  const [shouldGenerateReceipt, setShouldGenerateReceipt] = useState(true);

  const submit = async () => {
    const payment = await api.recordPayment(renterId, { monthPaid, amountPaid });
    if (shouldGenerateReceipt) {
      await api.generateReceipt({
        appartmentNumber,
        monthPaid: payment.monthPaid,
        amountPaid: payment.amountPaid,
        name: renterName,
      });
    }
    onComplete();
  };

  return (
    <div>
      <label htmlFor="monthPaid">Month paid</label>
      <input id="monthPaid" value={monthPaid} onChange={(event) => setMonthPaid(event.target.value)} />
      <label htmlFor="amountPaid">Amount paid</label>
      <input
        id="amountPaid"
        type="number"
        value={amountPaid}
        onChange={(event) => setAmountPaid(Number(event.target.value))}
      />
      <label htmlFor="receipt">Generate receipt</label>
      <input
        id="receipt"
        type="checkbox"
        checked={shouldGenerateReceipt}
        onChange={(event) => setShouldGenerateReceipt(event.target.checked)}
      />
      <button type="button" onClick={submit}>
        Mark paid
      </button>
    </div>
  );
}
