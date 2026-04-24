import { AlertTriangle } from "lucide-react";

import type { Renter } from "@/shared/api/types";

type Props = {
  renter: Renter;
  isSelected: boolean;
  onSelect: (renter: Renter) => void;
};

export function RenterCard({ renter, isSelected, onSelect }: Props) {
  const isOverdue = (renter.rentDue || 0) > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(renter)}
      aria-label={renter.name}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        background: "#fff",
        borderRadius: 6,
        padding: "18px 20px",
        border: "none",
        fontFamily: "inherit",
        boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
        outline: isSelected ? "1px solid rgba(198,198,205,0.15)" : "none",
        transform: isSelected ? "scale(1.01)" : "scale(1)",
        transition: "transform 300ms, background 300ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#e6e8ea",
            padding: "4px 10px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#191c1e",
          }}
        >
          Apt #{renter.appartmentNumber}
        </span>
        {isOverdue ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "#ffe9ec",
              padding: "4px 10px",
              borderRadius: 9999,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9f1239",
            }}
          >
            <AlertTriangle size={11} color="#9f1239" />
            Overdue
          </span>
        ) : null}
      </div>

      <p
        style={{
          margin: "0 0 14px",
          fontFamily: "Manrope, sans-serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "#191c1e",
          lineHeight: 1.2,
        }}
      >
        {renter.name}
      </p>

      <div style={{ background: "#f2f4f6", borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>
            Monthly rent
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#191c1e" }}>${renter.rentAmount.toLocaleString()}</span>
        </div>
        {isOverdue ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#be123c" }}>
              Balance due
            </span>
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 15, fontWeight: 700, color: "#be123c" }}>
              ${(renter.rentDue || 0).toLocaleString()}
            </span>
          </div>
        ) : null}
      </div>
    </button>
  );
}
