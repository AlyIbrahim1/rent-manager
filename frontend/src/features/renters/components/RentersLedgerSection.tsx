import { AlertCircle, Loader2, Plus } from "lucide-react";

import { RenterCard } from "@/features/renters/components/RenterCard";
import { RenterDetailsPanel } from "@/features/renters/components/RenterDetailsPanel";
import type { Renter } from "@/shared/api/types";

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  renters: Renter[];
  filteredRenters: Renter[];
  selectedRenterId: string | null;
  selectedRenter: Renter | null;
  onSelectRenter: (renter: Renter) => void;
  onAddRenter: () => void;
  onClearSearch: () => void;
  onCloseSelectedRenter: () => void;
  onMarkPaid: () => void;
};

export function RentersLedgerSection({
  isLoading,
  isError,
  hasData,
  renters,
  filteredRenters,
  selectedRenterId,
  selectedRenter,
  onSelectRenter,
  onAddRenter,
  onClearSearch,
  onCloseSelectedRenter,
  onMarkPaid,
}: Props) {
  const isEmpty = filteredRenters.length === 0;

  return (
    <section style={{ background: "#f2f4f6", borderRadius: 6, padding: "24px 20px 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#45464d",
              }}
            >
              Active portfolio
            </span>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredRenters.map((renter) => (
              <div key={renter.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <RenterCard
                  renter={renter}
                  isSelected={renter.id === selectedRenterId}
                  onSelect={onSelectRenter}
                />
                {renter.id === selectedRenterId && selectedRenter ? (
                  <div className="lg:hidden">
                    <RenterDetailsPanel
                      renter={selectedRenter}
                      onMarkPaid={onMarkPaid}
                      onClose={onCloseSelectedRenter}
                      variant="sheet"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
