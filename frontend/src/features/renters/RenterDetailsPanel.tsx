import { DollarSign, Calendar, AlertTriangle, X } from "lucide-react";
import type { Renter } from "../../api/types";
import { PaymentHistoryList } from "./PaymentHistoryList";

type Props = {
  renter: Renter | null;
  onMarkPaid: () => void;
  onClose: () => void;
};

export function RenterDetailsPanel({ renter, onMarkPaid, onClose }: Props) {
  if (!renter) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <p className="text-slate-400 text-sm">Select a renter to view details.</p>
      </div>
    );
  }

  const isOverdue = (renter.rentDue ?? 0) > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
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
          <h2 className="font-display text-xl text-slate-900 mt-2 leading-snug">{renter.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100 shrink-0"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <DollarSign size={14} />
            <span className="text-sm">Monthly rent</span>
          </div>
          <span className="mono text-sm font-semibold text-slate-800">${renter.rentAmount.toLocaleString()}</span>
        </div>

        {isOverdue && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle size={14} />
              <span className="text-sm">Balance due</span>
            </div>
            <span className="mono text-sm font-semibold text-orange-600">${(renter.rentDue ?? 0).toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={14} />
            <span className="text-sm">Last paid</span>
          </div>
          <span className="mono text-sm text-slate-700">{renter.lastMonthPayed ?? "—"}</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <button
          type="button"
          onClick={onMarkPaid}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer"
        >
          <DollarSign size={16} />
          Mark as Paid
        </button>
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment History</h3>
        <PaymentHistoryList renterId={renter.id} />
      </div>
    </div>
  );
}
