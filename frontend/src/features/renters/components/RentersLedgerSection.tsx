import { AlertCircle, Loader2, Plus } from "lucide-react";

import { RenterCard } from "@/features/renters/components/RenterCard";
import type { Renter } from "@/shared/api/types";

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
  const isEmpty = filteredRenters.length === 0;

  return (
    <div style={{ background: "#f2f4f6", borderRadius: 6, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#191c1e" }}>
            Renters Ledger
          </h3>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#45464d" }}>{renters.length} active units</p>
        </div>
        <span
          style={{
            background: "#e6e8ea",
            borderRadius: 9999,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: "#191c1e",
          }}
        >
          {renters.length}
        </span>
      </div>

      {isLoading ? (
        <div style={{ background: "#fff", borderRadius: 6, padding: "32px", textAlign: "center", color: "#45464d" }}>
          <Loader2 size={18} className="animate-spin" style={{ marginBottom: 8 }} />
          <p style={{ margin: 0, fontSize: 13 }}>Loading renters...</p>
        </div>
      ) : null}

      {isError ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#ffe9ec", borderRadius: 6, padding: "14px 16px", color: "#9f1239" }}>
          <AlertCircle size={16} color="#9f1239" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 13 }}>Unable to load renters. Check your connection and try again.</p>
        </div>
      ) : null}

      {hasData && renters.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 6, padding: "32px", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#191c1e" }}>No renters found</p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d" }}>Try a different search or add a new renter.</p>
          <button
            type="button"
            onClick={onAddRenter}
            style={{
              marginTop: 14,
              padding: "8px 16px",
              background: "linear-gradient(135deg, #0f172a, #131b2e)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={13} color="#fff" />
            Add Renter
          </button>
        </div>
      ) : null}

      {hasData && renters.length > 0 && isEmpty ? (
        <div style={{ background: "#fff", borderRadius: 6, padding: "32px", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#191c1e" }}>
            No renters match your search
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d" }}>Try a different search or add a new renter.</p>
          <button
            type="button"
            onClick={onClearSearch}
            style={{
              marginTop: 14,
              padding: "8px 16px",
              background: "linear-gradient(135deg, #0f172a, #131b2e)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Clear search
          </button>
        </div>
      ) : null}

      {hasData && renters.length > 0 && !isEmpty ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredRenters.map((renter) => (
            <RenterCard
              key={renter.id}
              renter={renter}
              isSelected={renter.id === selectedRenterId}
              onSelect={onSelectRenter}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
