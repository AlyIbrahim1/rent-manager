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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-in">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
          <h2 className="font-display text-xl text-slate-900">Add Renter</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="add-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="add-apt" className="block text-sm font-medium text-slate-700 mb-1.5">
              Apartment number <span className="text-red-500">*</span>
            </label>
            <input
              id="add-apt"
              type="number"
              min="1"
              value={appartmentNumber || ""}
              onChange={(e) => setAppartmentNumber(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="101"
            />
          </div>

          <div>
            <label htmlFor="add-rent" className="block text-sm font-medium text-slate-700 mb-1.5">
              Monthly rent ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium mono text-sm">$</span>
              <input
                id="add-rent"
                type="number"
                min="0"
                value={rentAmount || ""}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                required
                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mono"
                placeholder="1200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="add-lastpaid" className="block text-sm font-medium text-slate-700 mb-1.5">
              Last month paid
              <span className="text-slate-400 font-normal ml-1">(YYYY-MM)</span>
            </label>
            <input
              id="add-lastpaid"
              type="month"
              value={lastMonthPayed}
              onChange={(e) => setLastMonthPayed(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Adding…</> : "Add Renter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
