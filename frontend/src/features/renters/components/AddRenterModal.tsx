import { useEffect, useId, useState } from "react";
import { Building2, CalendarClock, Loader2, WalletCards, X } from "lucide-react";
import type { CreateRenterInput } from "@/shared/api/types";
import {
  MODAL_EXIT_DURATION_MS,
  floatingSurfaceLowStyle,
  floatingSurfaceLowestStyle,
  modalBackdropClass,
  modalFlowClass,
  modalPopClass,
  modalPrimaryButtonClass,
  modalPrimaryButtonStyle,
  modalSecondaryButtonClass,
  modalSecondaryButtonStyle,
  modalShellClass,
} from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRenterInput) => Promise<unknown>;
};

const inputClass =
  "w-full rounded-xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface shadow-[inset_0_0_0_1px_rgba(198,198,205,0.12)] transition-[background-color,box-shadow,transform] duration-200 placeholder:text-on-surface-muted/55 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/15 focus:[box-shadow:inset_0_0_0_1px_rgba(15,23,42,0.18),0_0_0_4px_rgba(15,23,42,0.06)]";
const labelClass =
  "mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-on-surface-muted";
const sectionCardClass = "rounded-[1.35rem] bg-surface-container-lowest p-5 shadow-[0_12px_40px_rgba(25,28,30,0.06)] sm:p-[1.35rem]";

export function AddRenterModal({ isOpen, onClose, onSubmit }: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const { isMounted, state } = useAnimatedPresence(isOpen, MODAL_EXIT_DURATION_MS);
  const [name, setName] = useState("");
  const [appartmentNumber, setAppartmentNumber] = useState(0);
  const [rentAmount, setRentAmount] = useState(0);
  const [lastMonthPayed, setLastMonthPayed] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isMounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMounted, isOpen, onClose]);

  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  if (!isMounted) return null;

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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-[2px] sm:p-6 ${modalBackdropClass}`}
      data-state={state}
      onClick={(e) => { if (e.target === e.currentTarget && isOpen) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={loading}
        data-state={state}
        className={`w-full max-w-[42rem] overflow-hidden rounded-[1.75rem] bg-surface-container-lowest shadow-modal ${modalShellClass} ${modalFlowClass}`}
        style={floatingSurfaceLowestStyle}
      >
        <div className="flex items-start justify-between gap-4 bg-surface-container-low px-5 py-5 sm:px-6 sm:py-5" style={floatingSurfaceLowStyle}>
          <div className="max-w-[32rem]">
            <h2 id={titleId} className="font-heading text-[1.75rem] font-bold leading-[1.05] text-on-surface sm:text-[1.85rem]">
              Add New Renter
            </h2>
            <p id={descriptionId} className="mt-2 max-w-[30rem] text-sm leading-6 text-on-surface-muted">
              Enter the lease details for your next resident and start tracking monthly payments from a clean ledger.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-transparent text-on-surface-muted transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-surface-container-high hover:text-on-surface hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 bg-surface-container-low px-4 py-4 sm:px-5 sm:py-5" style={floatingSurfaceLowStyle}>
          <section className={sectionCardClass} style={floatingSurfaceLowestStyle}>
            <div className="mb-4 flex items-center gap-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-container text-on-surface ${modalPopClass}`} data-state={state}>
                <Building2 size={18} />
              </span>
              <div>
                <h3 className="font-heading text-[1.15rem] font-bold text-on-surface">Basic Information</h3>
                <p className="text-sm text-on-surface-muted">Assign the renter and unit details that anchor the ledger.</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label htmlFor="add-name" className={labelClass}>
                  Renter name
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className={inputClass}
                  placeholder="e.g. Nadia Khalil"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="add-apt" className={labelClass}>
                    Apartment number
                  </label>
                  <input
                    id="add-apt"
                    type="number"
                    min="1"
                    value={appartmentNumber || ""}
                    onChange={(e) => setAppartmentNumber(Number(e.target.value))}
                    required
                    className={inputClass}
                    placeholder="12"
                  />
                </div>

                <div>
                  <label htmlFor="add-rent" className={labelClass}>
                    Monthly rent
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-muted">
                      $
                    </span>
                    <input
                      id="add-rent"
                      type="number"
                      min="0"
                      value={rentAmount || ""}
                      onChange={(e) => setRentAmount(Number(e.target.value))}
                      required
                      className={`${inputClass} pl-8`}
                      placeholder="1,850"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCardClass} style={floatingSurfaceLowestStyle}>
            <div className="mb-4 flex items-center gap-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-container text-on-surface ${modalPopClass}`} data-state={state}>
                <CalendarClock size={18} />
              </span>
              <div>
                <h3 className="font-heading text-[1.15rem] font-bold text-on-surface">Payment Tracking</h3>
                <p className="text-sm text-on-surface-muted">Set the most recent paid month so arrears calculations start in the right place.</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,16rem)]">
              <div>
                <label htmlFor="add-lastpaid" className={labelClass}>
                  Last month paid
                </label>
                <input
                  id="add-lastpaid"
                  type="month"
                  value={lastMonthPayed}
                  onChange={(e) => setLastMonthPayed(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-2 text-sm leading-6 text-on-surface-muted">
                  Leave this blank when the renter has not made their first payment yet.
                </p>
              </div>

              <aside className="rounded-[1.2rem] bg-surface-container-low p-4 text-sm text-on-surface" style={floatingSurfaceLowStyle}>
                <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                  <WalletCards size={15} />
                  Ledger preview
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-surface-container-lowest px-4 py-3" style={floatingSurfaceLowestStyle}>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">Expected rent</p>
                    <p className="mt-1 font-heading text-2xl font-bold leading-none text-on-surface">
                      ${rentAmount > 0 ? rentAmount.toLocaleString() : "0"}
                    </p>
                  </div>
                  <p className="leading-6 text-on-surface-muted">
                    Saving this renter creates a live ledger entry and keeps future payment history tied to the selected apartment.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 bg-surface-container-low px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-5 sm:py-4" style={floatingSurfaceLowStyle}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={modalSecondaryButtonClass}
            style={modalSecondaryButtonStyle}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={modalPrimaryButtonClass}
            style={modalPrimaryButtonStyle}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving renter...
              </>
            ) : (
              "Save renter"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
