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
      className={`w-full text-left bg-white rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isSelected
          ? "border-blue-500 shadow-md ring-2 ring-blue-200"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="inline-flex items-center bg-blue-100 text-blue-700 font-semibold text-xs rounded-full px-2.5 py-1">
          Apt #{renter.appartmentNumber}
        </span>
        {isOverdue && (
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 font-semibold text-xs rounded-full px-2.5 py-1">
            <AlertTriangle size={11} />
            Overdue
          </span>
        )}
      </div>

      <p className="font-semibold text-slate-900 text-base leading-snug mb-2">{renter.name}</p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-slate-500 text-xs">Monthly rent</span>
        <span className="mono text-slate-800 font-medium text-sm">${renter.rentAmount.toLocaleString()}</span>
      </div>

      {isOverdue && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-orange-600 text-xs font-medium">Balance due</span>
          <span className="mono text-orange-600 font-semibold text-sm">${(renter.rentDue ?? 0).toLocaleString()}</span>
        </div>
      )}
    </button>
  );
}
