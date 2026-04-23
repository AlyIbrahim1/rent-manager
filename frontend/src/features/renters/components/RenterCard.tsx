import { AlertTriangle } from "lucide-react";
import type { Renter } from "@/shared/api/types";

type Props = {
  renter: Renter;
  isSelected: boolean;
  onSelect: (renter: Renter) => void;
};

export function RenterCard({ renter, isSelected, onSelect }: Props) {
  const isOverdue = (renter.rentDue ?? 0) > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(renter)}
      className={`w-full cursor-pointer rounded-md p-4 text-left transition-all duration-300 hover:scale-[1.01] sm:p-5 focus:outline-none ${
        isSelected
          ? "bg-surface-container-lowest shadow-layer ring-1 ring-outline-variant/15"
          : "bg-surface-container-lowest hover:bg-surface-bright"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="inline-flex items-center rounded-sm bg-surface-container-high px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface">
          Apt #{renter.appartmentNumber}
        </span>
        {isOverdue && (
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#ffe9ec] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9f1239]">
            <AlertTriangle size={12} strokeWidth={3} />
            Overdue
          </span>
        )}
      </div>

      <p className="mb-4 font-heading text-lg font-bold leading-snug text-on-surface sm:text-xl">{renter.name}</p>

      <div className="space-y-2 rounded-sm bg-surface-container-low px-3 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">Monthly rent</span>
          <span className="text-sm font-medium text-on-surface">${renter.rentAmount.toLocaleString()}</span>
        </div>

        {isOverdue && (
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#be123c]">Balance due</span>
            <span className="font-heading text-base font-bold text-[#be123c]">${(renter.rentDue ?? 0).toLocaleString()}</span>
          </div>
        )}
      </div>
    </button>
  );
}
