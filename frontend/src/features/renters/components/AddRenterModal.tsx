import { useEffect, useState } from "react";
import { Building2, CalendarClock, Loader2, X } from "lucide-react";

import type { CreateRenterInput } from "@/shared/api/types";
import { MODAL_EXIT_DURATION_MS, modalBackdropClass, modalShellClass } from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRenterInput) => Promise<unknown>;
};

export function AddRenterModal({ isOpen, onClose, onSubmit }: Props) {
  const { isMounted, state } = useAnimatedPresence(isOpen, MODAL_EXIT_DURATION_MS);
  const [name, setName] = useState("");
  const [apt, setApt] = useState("");
  const [rent, setRent] = useState("");
  const [lastPaid, setLastPaid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMounted, isOpen, onClose]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyPaddingRight = bodyStyle.paddingRight;
    const previousHtmlOverflow = htmlStyle.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    bodyStyle.overflow = "hidden";
    htmlStyle.overflow = "hidden";

    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.paddingRight = previousBodyPaddingRight;
      htmlStyle.overflow = previousHtmlOverflow;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setApt("");
      setRent("");
      setLastPaid("");
    }
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    background: "#e0e3e5",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    color: "#191c1e",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#45464d",
    marginBottom: 7,
  };

  const sectionCard: React.CSSProperties = {
    background: "#fff",
    borderRadius: 22,
    padding: "18px 20px",
    boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        appartmentNumber: Number(apt),
        rentAmount: Number(rent),
        lastMonthPayed: lastPaid || null,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={modalBackdropClass}
      data-state={state}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,0.50)",
        backdropFilter: "blur(2px)",
        padding: 24,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={modalShellClass}
        data-state={state}
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
        }}
      >
        <div style={{ background: "#f2f4f6", padding: "22px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.1 }}>
              Add New Renter
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d", lineHeight: 1.5 }}>
              Enter lease details and start tracking monthly payments from a clean ledger.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#45464d",
            }}
            aria-label="Close"
          >
            <X size={17} color="#45464d" />
          </button>
        </div>

        <div style={{ background: "#f2f4f6", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 34, height: 34, borderRadius: 16, background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={16} color="#191c1e" />
              </span>
              <div>
                <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#191c1e" }}>Basic Information</p>
                <p style={{ margin: "1px 0 0", fontSize: 12, color: "#45464d" }}>Assign the renter and unit details.</p>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle} htmlFor="renter-name">Renter name</label>
              <input id="renter-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Nadia Khalil" style={inputStyle} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle} htmlFor="apartment-number">Apartment number</label>
                <input id="apartment-number" type="number" min="1" value={apt} onChange={(e) => setApt(e.target.value)} required placeholder="12" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="monthly-rent">Monthly rent</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 500, color: "#45464d", pointerEvents: "none" }}>$</span>
                  <input
                    id="monthly-rent"
                    type="number"
                    min="0"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    required
                    placeholder="1,850"
                    style={{ ...inputStyle, paddingLeft: 28 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 34, height: 34, borderRadius: 16, background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarClock size={16} color="#191c1e" />
              </span>
              <div>
                <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#191c1e" }}>Payment Tracking</p>
                <p style={{ margin: "1px 0 0", fontSize: 12, color: "#45464d" }}>Set the most recent paid month.</p>
              </div>
            </div>
            <label style={labelStyle} htmlFor="last-month-paid">Last month paid</label>
            <input id="last-month-paid" type="month" value={lastPaid} onChange={(e) => setLastPaid(e.target.value)} style={inputStyle} />
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#45464d", lineHeight: 1.5 }}>
              Leave blank when the renter has not made their first payment yet.
            </p>
          </div>
        </div>

        <div style={{ background: "#f2f4f6", padding: "12px 16px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "9px 18px", background: "#fff", color: "#191c1e", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "9px 18px",
              background: "linear-gradient(135deg, #0f172a, #131b2e)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" color="#fff" /> : null}
            {loading ? "Saving renter..." : "Save renter"}
          </button>
        </div>
      </form>
    </div>
  );
}
