import { useEffect, useState } from "react";
import { X, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "../../api/client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
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

export function MarkPaidModal({ isOpen, onClose, renterId, renterName, appartmentNumber, defaultAmount, onComplete }: Props) {
  const [monthPaid, setMonthPaid] = useState(currentYearMonth);
  const [amountPaid, setAmountPaid] = useState(defaultAmount);
  const [shouldGenerateReceipt, setShouldGenerateReceipt] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAmountPaid(defaultAmount);
    setMonthPaid(currentYearMonth());
    setError(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, defaultAmount]);

  if (!isOpen) return null;

  const submit = async () => {
    setError(null);
    setLoading(true);
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
          setError("Payment recorded but receipt generation failed.");
        }
      }
      onComplete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-in">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="font-display text-xl text-slate-900">Record Payment</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {renterName} · <span className="mono">Apt #{appartmentNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-5">
          <div>
            <label htmlFor="month-paid" className="block text-sm font-medium text-slate-700 mb-1.5">
              Month paid <span className="text-red-500">*</span>
            </label>
            <input
              id="month-paid"
              type="month"
              value={monthPaid}
              onChange={(e) => setMonthPaid(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="amount-paid" className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount paid <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium mono text-sm">$</span>
              <input
                id="amount-paid"
                type="number"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mono"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                checked={shouldGenerateReceipt}
                onChange={(e) => setShouldGenerateReceipt(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors duration-200" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">Generate receipt</span>
          </label>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Recording…</>
              ) : (
                <><CheckCircle2 size={16} /> Record Payment</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
