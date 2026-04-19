import { DollarSign, Calendar, AlertTriangle, X } from "lucide-react";
import type { Renter } from "../../api/types";
import { PaymentHistoryList } from "./PaymentHistoryList";

type Props = {
  renter: Renter | null;
  onMarkPaid: () => void;
  onClose: () => void;
  variant?: "default" | "sheet";
};

export function RenterDetailsPanel({ renter, onMarkPaid, onClose, variant = "default" }: Props) {
  const isSheet = variant === "sheet";

  if (!renter) {
    return (
      <div className="rounded-md bg-surface-container-low p-6">
        <div className="rounded-sm bg-surface-container-lowest p-8 text-center">
          <p className="font-heading text-2xl font-semibold text-on-surface">No renter selected</p>
          <p className="mt-2 text-sm text-on-surface-muted">Select a card from the ledger to inspect payment and due status.</p>
        </div>
      </div>
    );
  }

  const isOverdue = (renter.rentDue ?? 0) > 0;

  return (
    <section className={isSheet ? "rounded-md bg-surface-container-lowest p-3" : "rounded-md bg-surface-container-low p-5 sm:p-6"}>
      <div className={isSheet ? "rounded-sm bg-surface-container-low px-4 py-4 shadow-layer" : "rounded-sm bg-surface-container-lowest px-5 py-5 shadow-layer"}>
        <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-sm bg-surface-container-high px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface">
              Apt #{renter.appartmentNumber}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-[#ffe9ec] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9f1239]">
                <AlertTriangle size={11} />
                Overdue
              </span>
            )}
          </div>
          <h2 className="mt-3 font-heading text-[1.4rem] font-bold leading-snug text-on-surface">{renter.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-sm bg-surface-container-high p-1.5 text-on-surface-muted transition-colors hover:bg-surface-container"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 space-y-3 rounded-sm bg-surface-container-low px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface-muted">
            <DollarSign size={14} />
            <span className="text-sm">Monthly rent</span>
          </div>
          <span className="text-sm font-semibold text-on-surface">${renter.rentAmount.toLocaleString()}</span>
        </div>

        {isOverdue && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#be123c]">
              <AlertTriangle size={14} />
              <span className="text-sm">Balance due</span>
            </div>
            <span className="text-sm font-semibold text-[#be123c]">${(renter.rentDue ?? 0).toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface-muted">
            <Calendar size={14} />
            <span className="text-sm">Last paid</span>
          </div>
          <span className="text-sm text-on-surface">{renter.lastMonthPayed ?? "-"}</span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onMarkPaid}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-tertiary-container px-4 py-2.5 text-sm font-semibold text-tertiary-fixed transition-opacity hover:opacity-90"
        >
          <DollarSign size={16} />
          Receive Payment
        </button>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">Payment History</h3>
        <PaymentHistoryList renterId={renter.id} />
      </div>
      </div>
    </section>
  );
}
