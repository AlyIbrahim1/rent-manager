import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { CreateRenterInput } from "../../api/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRenterInput) => Promise<unknown>;
};

export function AddRenterModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [appartmentNumber, setAppartmentNumber] = useState(0);
  const [rentAmount, setRentAmount] = useState(0);
  const [lastMonthPayed, setLastMonthPayed] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyPaddingRight = bodyStyle.paddingRight;
    const previousBodyTouchAction = bodyStyle.touchAction;
    const previousHtmlOverflow = htmlStyle.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    bodyStyle.overflow = "hidden";
    bodyStyle.touchAction = "none";
    htmlStyle.overflow = "hidden";

    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.paddingRight = previousBodyPaddingRight;
      bodyStyle.touchAction = previousBodyTouchAction;
      htmlStyle.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, appartmentNumber, rentAmount, lastMonthPayed: lastMonthPayed || null });
      setName("");
      setAppartmentNumber(0);
      setRentAmount(0);
      setLastMonthPayed("");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4 backdrop-blur-xl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-modal-in relative w-full max-w-xl overflow-hidden rounded-[24px] border border-white/45 bg-surface/85 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.75)]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-tertiary-fixed/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-12 h-60 w-60 rounded-full bg-[#bfdbfe]/55 blur-3xl" />

        <div className="relative px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
          <div className="flex items-start justify-between gap-4 pb-5">
            <div>
              <h2 className="font-heading text-[1.6rem] font-bold leading-tight text-on-surface">Add Renter</h2>
              <p className="mt-1 text-sm text-on-surface-muted">
                Capture lease details to start payment tracking.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-outline-variant/30 bg-white/70 p-2 text-on-surface-muted transition-all hover:bg-white hover:text-on-surface"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2 rounded-2xl border border-outline-variant/30 bg-white/65 px-4 py-3 backdrop-blur-sm shadow-[0_14px_28px_-24px_rgba(15,23,42,0.9)]">
                <label htmlFor="add-name" className="block text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                  Full name
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest/90 px-4 py-3.5 text-sm text-on-surface placeholder:text-on-surface-muted transition-colors focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Jane Smith"
                />
              </div>

              <div className="rounded-2xl border border-outline-variant/30 bg-white/65 px-4 py-3 backdrop-blur-sm shadow-[0_14px_28px_-24px_rgba(15,23,42,0.9)]">
                <label htmlFor="add-apt" className="block text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                  Apartment number
                </label>
                <input
                  id="add-apt"
                  type="number"
                  min="1"
                  value={appartmentNumber || ""}
                  onChange={(e) => setAppartmentNumber(Number(e.target.value))}
                  required
                  className="mt-2 w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest/90 px-4 py-3.5 text-sm text-on-surface placeholder:text-on-surface-muted transition-colors focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="101"
                />
              </div>

              <div className="rounded-2xl border border-outline-variant/30 bg-white/65 px-4 py-3 backdrop-blur-sm shadow-[0_14px_28px_-24px_rgba(15,23,42,0.9)]">
                <label htmlFor="add-rent" className="block text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                  Monthly rent
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-on-surface-muted">$</span>
                  <input
                    id="add-rent"
                    type="number"
                    min="0"
                    value={rentAmount || ""}
                    onChange={(e) => setRentAmount(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest/90 py-3.5 pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface-muted transition-colors focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-outline-variant/30 bg-white/65 px-4 py-3 backdrop-blur-sm shadow-[0_14px_28px_-24px_rgba(15,23,42,0.9)]">
                <label htmlFor="add-lastpaid" className="block text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                  Last month paid
                  <span className="ml-1 text-[0.7rem] font-medium tracking-normal text-on-surface-muted">(YYYY-MM)</span>
                </label>
                <input
                  id="add-lastpaid"
                  type="month"
                  value={lastMonthPayed}
                  onChange={(e) => setLastMonthPayed(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest/90 px-4 py-3.5 text-sm text-on-surface placeholder:text-on-surface-muted transition-colors focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-outline-variant/35 bg-white/70 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: "#1e3a8a",
                  border: "1px solid rgba(191, 219, 254, 0.75)",
                  boxShadow: "0 14px 28px -18px rgba(30, 58, 138, 0.95)",
                }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Adding...</> : "Add Renter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
