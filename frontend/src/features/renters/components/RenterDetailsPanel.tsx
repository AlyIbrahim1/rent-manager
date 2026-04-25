import { AlertTriangle, Calendar, DollarSign, X } from "lucide-react";

import type { Renter } from "@/shared/api/types";
import { PaymentHistoryList } from "./PaymentHistoryList";

type Props = {
  renter: Renter | null;
  onMarkPaid: () => void;
  onClose: () => void;
  variant?: "default" | "sheet";
};

export function RenterDetailsPanel({ renter, onMarkPaid, onClose, variant = "default" }: Props) {
  if (!renter) {
    return (
      <section style={{ background: "#f2f4f6", borderRadius: 6, padding: 20, minHeight: 280 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 4,
            padding: "44px 24px",
            textAlign: "center",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>
            Detail panel
          </p>
          <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#191c1e" }}>
            No renter selected
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d" }}>
            Select a card from the ledger to inspect payment and due status.
          </p>
        </div>
      </section>
    );
  }

  const isOverdue = (renter.rentDue || 0) > 0;
  const rowStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between" };
  const iconRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, color: "#45464d" };
  const outerPadding = variant === "sheet" ? 0 : 20;
  const sectionStyle: React.CSSProperties =
    variant === "sheet"
      ? { background: "transparent", borderRadius: 0, padding: outerPadding }
      : { background: "#f2f4f6", borderRadius: 6, padding: outerPadding };

  return (
    <section style={sectionStyle}>
      <div style={{ background: "#fff", borderRadius: 4, padding: "18px 20px", boxShadow: "0 12px 40px rgba(25,28,30,0.06)" }}>
        <p style={{ margin: "0 0 14px", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>
          Detail panel
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
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
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#9f1239",
                  }}
                >
                  <AlertTriangle size={11} color="#9f1239" />
                  Overdue
                </span>
              ) : null}
            </div>
            <h2 style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.2 }}>
              {renter.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              background: "#e6e8ea",
              border: "none",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#45464d",
            }}
            aria-label="Close details"
          >
            <X size={16} color="#45464d" />
          </button>
        </div>

        <div style={{ background: "#f2f4f6", borderRadius: 4, padding: "12px 14px", marginBottom: 16 }}>
          <div style={rowStyle}>
            <div style={iconRowStyle}>
              <DollarSign size={13} color="#45464d" />
              <span style={{ fontSize: 13 }}>Monthly rent</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#191c1e" }}>${renter.rentAmount.toLocaleString()}</span>
          </div>

          {isOverdue ? (
            <div style={{ ...rowStyle, marginTop: 10 }}>
              <div style={{ ...iconRowStyle, color: "#be123c" }}>
                <AlertTriangle size={13} color="#be123c" />
                <span style={{ fontSize: 13, color: "#be123c" }}>Balance due</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#be123c" }}>${(renter.rentDue || 0).toLocaleString()}</span>
            </div>
          ) : null}

          <div style={{ ...rowStyle, marginTop: 10 }}>
            <div style={iconRowStyle}>
              <Calendar size={13} color="#45464d" />
              <span style={{ fontSize: 13 }}>Last paid</span>
            </div>
            <span style={{ fontSize: 13, color: "#191c1e" }}>{renter.lastMonthPayed || "—"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onMarkPaid}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "10px",
            background: "#002114",
            color: "#85f8c4",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: 18,
          }}
        >
          <DollarSign size={14} color="#85f8c4" />
          Receive Payment
        </button>

        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>
            Payment History
          </h3>
          <PaymentHistoryList renterId={renter.id} />
        </div>
      </div>
    </section>
  );
}
