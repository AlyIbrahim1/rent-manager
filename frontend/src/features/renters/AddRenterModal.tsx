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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/45 p-4 backdrop-blur-xl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-modal-in w-full max-w-md rounded-md bg-surface/90 p-6 shadow-floating">
        <div className="flex items-center justify-between pb-3">
          <h2 className="font-heading text-[1.4rem] font-bold text-on-surface">Add Renter</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm bg-surface-container-high p-1.5 text-on-surface-muted transition-colors hover:bg-surface-container"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          <div>
            <label htmlFor="add-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
              Full name
            </label>
            <input
              id="add-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-sm bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:bg-surface-container-lowest focus:outline-none focus:[box-shadow:inset_0_-2px_0_0_#0f172a]"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="add-apt" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
              Apartment number
            </label>
            <input
              id="add-apt"
              type="number"
              min="1"
              value={appartmentNumber || ""}
              onChange={(e) => setAppartmentNumber(Number(e.target.value))}
              required
              className="w-full rounded-sm bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:bg-surface-container-lowest focus:outline-none focus:[box-shadow:inset_0_-2px_0_0_#0f172a]"
              placeholder="101"
            />
          </div>

          <div>
            <label htmlFor="add-rent" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
              Monthly rent
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-muted">$</span>
              <input
                id="add-rent"
                type="number"
                min="0"
                value={rentAmount || ""}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                required
                className="w-full rounded-sm bg-surface-container-highest py-3 pl-8 pr-4 text-sm text-on-surface placeholder:text-on-surface-muted focus:bg-surface-container-lowest focus:outline-none focus:[box-shadow:inset_0_-2px_0_0_#0f172a]"
                placeholder="1200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="add-lastpaid" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
              Last month paid
              <span className="ml-1 font-medium tracking-normal text-on-surface-muted">(YYYY-MM)</span>
            </label>
            <input
              id="add-lastpaid"
              type="month"
              value={lastMonthPayed}
              onChange={(e) => setLastMonthPayed(e.target.value)}
              className="w-full rounded-sm bg-surface-container-highest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:bg-surface-container-lowest focus:outline-none focus:[box-shadow:inset_0_-2px_0_0_#0f172a]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-sm bg-surface-container-high px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Adding…</> : "Add Renter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
