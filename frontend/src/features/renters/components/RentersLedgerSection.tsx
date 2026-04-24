import { Plus, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import type { Renter } from "@/shared/api/types";
import { RenterCard } from "@/features/renters/components/RenterCard";

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  renters: Renter[];
  filteredRenters: Renter[];
  selectedRenterId: string | null;
  onSelectRenter: (renter: Renter) => void;
  onAddRenter: () => void;
  onClearSearch: () => void;
};

export function RentersLedgerSection({
  isLoading,
  isError,
  hasData,
  renters,
  filteredRenters,
  selectedRenterId,
  onSelectRenter,
  onAddRenter,
  onClearSearch,
}: Props) {
  return (
    <div className="space-y-5 rounded-md bg-surface-container-low p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-[1.35rem] font-bold text-on-surface sm:text-2xl">Renters Ledger</h2>
          <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
            {filteredRenters.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddRenter}
          className="inline-flex items-center gap-1.5 rounded-sm bg-surface-container-high px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          Add
          <ChevronRight size={14} />
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 rounded-md bg-surface-container-lowest py-14 text-on-surface-muted">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading renters...</span>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 rounded-md bg-[#ffe9ec] px-5 py-4 text-[#9f1239]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">Unable to load renters. Check your connection and try again.</p>
        </div>
      )}

      {hasData && renters.length === 0 && (
        <div className="rounded-md bg-surface-container-lowest px-6 py-16 text-center">
          <p className="font-heading text-3xl font-semibold text-on-surface">No renters yet</p>
          <p className="mt-2 text-sm text-on-surface-muted">Start your ledger with the first active unit.</p>
          <button
            type="button"
            onClick={onAddRenter}
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            <Plus size={15} />
            Add Renter
          </button>
        </div>
      )}

      {hasData && renters.length > 0 && filteredRenters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredRenters.map((renter) => (
            <RenterCard
              key={renter.id}
              renter={renter}
              isSelected={selectedRenterId === renter.id}
              onSelect={onSelectRenter}
            />
          ))}
        </div>
      )}

      {hasData && renters.length > 0 && filteredRenters.length === 0 && (
        <div className="rounded-md bg-surface-container-lowest px-6 py-16 text-center">
          <p className="font-heading text-3xl font-semibold text-on-surface">No renters match your search</p>
          <p className="mt-2 text-sm text-on-surface-muted">Try a renter name or apartment number.</p>
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
