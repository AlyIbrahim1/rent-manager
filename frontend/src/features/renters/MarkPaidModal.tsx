import { useState } from "react";

import { api } from "../../api/client";

type Props = {
  renterId: string;
  renterName: string;
  appartmentNumber: number;
  defaultAmount: number;
  onComplete: () => void;
};

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function MarkPaidModal({ renterId, renterName, appartmentNumber, defaultAmount, onComplete }: Props) {
  const [monthPaid, setMonthPaid] = useState(currentYearMonth);
  const [amountPaid, setAmountPaid] = useState(defaultAmount);
  const [shouldGenerateReceipt, setShouldGenerateReceipt] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      const payment = await api.recordPayment(renterId, { monthPaid, amountPaid });
      if (shouldGenerateReceipt) {
        try {
          await api.generateReceipt({
            appartmentNumber,
            monthPaid: payment.monthPaid,
            amountPaid: payment.amountPaid,
            name: renterName,
          });
        } catch {
          // Receipt generation failure is non-fatal — payment already recorded
          setError("Payment recorded but receipt generation failed.");
        }
      }
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    }
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
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={submit}>
        Mark paid
      </button>
    </div>
  );
}
