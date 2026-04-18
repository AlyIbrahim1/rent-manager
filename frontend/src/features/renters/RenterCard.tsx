import { AlertTriangle } from "lucide-react";
import type { Renter } from "../../api/types";

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
      className={`w-full text-left rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-0.5 focus:outline-none ${
        isSelected
          ? "bg-surface border-none shadow-layer ring-1 ring-outline-variant/15"
          : "bg-surface-container-lowest border-none hover:bg-surface-container-low hover:shadow-floating"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className="inline-flex items-center bg-surface-container-highest text-on-surface font-semibold text-xs tracking-widest uppercase rounded-sm px-2 py-1">
          Apt #{renter.appartmentNumber}
        </span>
        {isOverdue && (
          <span className="inline-flex items-center gap-1.5 bg-error-container/20 text-error-container font-bold text-[10px] tracking-superwide uppercase rounded-sm px-2 py-1">
            <AlertTriangle size={12} strokeWidth={3} />
            Overdue
          </span>
        )}
      </div>

      <p className="font-heading font-bold text-on-surface text-xl leading-snug mb-4">{renter.name}</p>

      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-outline-variant/20">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-muted text-xs uppercase tracking-widest font-semibold">Monthly rent</span>
          <span className="font-sans font-medium text-on-surface text-sm">${renter.rentAmount.toLocaleString()}</span>
        </div>

        {isOverdue && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-error-container text-xs uppercase tracking-widest font-bold">Balance due</span>
            <span className="font-heading font-extrabold text-error-container text-base">${(renter.rentDue ?? 0).toLocaleString()}</span>
          </div>
        )}
      </div>
    </button>
  );
}
