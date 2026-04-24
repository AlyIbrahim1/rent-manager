import { useEffect, useState } from "react";
import { X, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/shared/api/client";
import {
  MODAL_EXIT_DURATION_MS,
  floatingSurfaceBaseStyle,
  modalBackdropClass,
  modalFlowClass,
  modalPopClass,
  modalShellClass,
} from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

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
  const { isMounted, state } = useAnimatedPresence(isOpen, MODAL_EXIT_DURATION_MS);
  const [monthPaid, setMonthPaid] = useState(currentYearMonth);
  const [amountPaid, setAmountPaid] = useState(defaultAmount);
  const [shouldGenerateReceipt, setShouldGenerateReceipt] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isMounted) return;
    setAmountPaid(defaultAmount);
    setMonthPaid(currentYearMonth());
    setError(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [defaultAmount, isMounted, isOpen, onClose]);

  if (!isMounted) return null;

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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4 backdrop-blur-xl ${modalBackdropClass}`}
      data-state={state}
      onClick={(e) => { if (e.target === e.currentTarget && isOpen) onClose(); }}
    >
      <div
        data-state={state}
        className={`w-full max-w-md rounded-md bg-surface/90 p-6 shadow-floating ${modalShellClass} ${modalFlowClass}`}
        style={floatingSurfaceBaseStyle}
      >
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="font-heading text-[1.4rem] font-bold text-on-surface">Record Payment</h2>
            <p className="mt-0.5 text-sm text-on-surface-muted">
              {renterName} · Apt #{appartmentNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm bg-surface-container-high p-1.5 text-on-surface-muted transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-surface-container hover:text-on-surface hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.97]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 pt-3">
          <div>
            <label htmlFor="month-paid" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
              Month paid
            </label>
            <input
              id="month-paid"
              type="month"
              value={monthPaid}
              onChange={(e) => setMonthPaid(e.target.value)}
              className="w-full rounded-sm bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:bg-surface-container-lowest focus:outline-none focus:[box-shadow:inset_0_-2px_0_0_#0f172a]"
            />
          </div>

          <div>
            <label htmlFor="amount-paid" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
              Amount paid
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-muted">$</span>
              <input
                id="amount-paid"
                type="number"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full rounded-sm bg-surface-container-highest py-3 pl-8 pr-4 text-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:[box-shadow:inset_0_-2px_0_0_#0f172a]"
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
              <div className="h-6 w-10 rounded-full bg-surface-container-high transition-colors duration-200 ease-[var(--ease-out-quart)] peer-checked:bg-[#059669]" />
              <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-out-quint)] peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-medium text-on-surface">Generate receipt</span>
          </label>

          {error && (
            <div className={`flex items-start gap-2.5 rounded-sm bg-[#ffe9ec] px-4 py-3 ${modalPopClass}`} data-state={state} role="alert">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#be123c]" />
              <p className="text-sm text-[#9f1239]">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-sm bg-surface-container-high px-4 py-2.5 text-sm font-medium text-on-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-surface-container hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.985]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-tertiary-container px-4 py-2.5 text-sm font-semibold text-tertiary-fixed shadow-[0_1px_2px_rgba(0,33,20,0.22)] transition-[opacity,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:opacity-95 hover:shadow-[0_12px_24px_rgba(0,33,20,0.16)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_1px_2px_rgba(0,33,20,0.22)]"
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
