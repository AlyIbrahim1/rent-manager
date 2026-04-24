import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Receipt, Wallet, X } from "lucide-react";

import { api } from "@/shared/api/client";
import { MODAL_EXIT_DURATION_MS, modalBackdropClass, modalShellClass } from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  renterId: string;
  renterName: string;
  appartmentNumber: number;
  defaultAmount: number;
  onComplete: () => void;
};

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function MarkPaidModal({
  isOpen,
  onClose,
  renterId,
  renterName,
  appartmentNumber,
  defaultAmount,
  onComplete,
}: Props) {
  const { isMounted, state } = useAnimatedPresence(isOpen, MODAL_EXIT_DURATION_MS);
  const [monthPaid, setMonthPaid] = useState(currentYearMonth);
  const [amountPaid, setAmountPaid] = useState(defaultAmount);
  const [shouldGenerateReceipt, setShouldGenerateReceipt] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    setAmountPaid(defaultAmount);
    setMonthPaid(currentYearMonth());
    setError(null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [defaultAmount, isMounted, isOpen, onClose]);

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

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const payment = await api.recordPayment(renterId, { monthPaid, amountPaid });
      if (shouldGenerateReceipt) {
        try {
          await api.generateReceipt({
            appartmentNumber,
            monthPaid: payment.monthPaid,
            amountPaid: payment.amountPaid,
            name: renterName,
          });
        } catch {
          setError("Payment was recorded, but receipt generation failed.");
        }
      }
      onComplete();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

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
        if (event.target === event.currentTarget && isOpen) {
          onClose();
        }
      }}
    >
      <div
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
        <div style={{ background: "#f2f4f6", padding: "22px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>
              Receive Payment
            </p>
            <h2 style={{ margin: "10px 0 0", fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.1 }}>
              Record the latest cycle.
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d", lineHeight: 1.5 }}>{renterName} · Apt #{appartmentNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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
          >
            <X size={17} color="#45464d" />
          </button>
        </div>

        <div style={{ background: "#f2f4f6", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 34, height: 34, borderRadius: 16, background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wallet size={16} color="#191c1e" />
              </span>
              <div>
                <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#191c1e" }}>Payment Details</p>
                <p style={{ margin: "1px 0 0", fontSize: 12, color: "#45464d" }}>
                  Record the rent month and amount, then decide whether the workspace should generate a receipt.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="month-paid" style={labelStyle}>Month paid</label>
                <input
                  id="month-paid"
                  type="month"
                  value={monthPaid}
                  onChange={(e) => setMonthPaid(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="amount-paid" style={labelStyle}>Amount paid</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-muted">$</span>
                  <input
                    id="amount-paid"
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    style={{ ...inputStyle, paddingLeft: 28 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 34, height: 34, borderRadius: 16, background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Receipt size={16} color="#191c1e" />
              </span>
              <div>
                <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#191c1e" }}>Receipt Output</p>
                <p style={{ margin: "1px 0 0", fontSize: 12, color: "#45464d" }}>
                  Generate a receipt document after recording the payment.
                </p>
              </div>
            </div>

            <label style={{ display: "flex", cursor: "pointer", alignItems: "center", justifyContent: "space-between", gap: 14, background: "#eceef0", borderRadius: 12, padding: "14px 16px" }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#45464d" }}>
                  Generate receipt
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d", lineHeight: 1.5 }}>Create the PDF receipt as part of this payment flow.</p>
              </div>
              <div className="relative shrink-0">
                <input type="checkbox" checked={shouldGenerateReceipt} onChange={(e) => setShouldGenerateReceipt(e.target.checked)} className="peer sr-only" />
                <div
                  style={{
                    height: 24,
                    width: 40,
                    borderRadius: 9999,
                    background: shouldGenerateReceipt ? "#047857" : "#c6c6cd",
                    transition: "background 200ms",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: shouldGenerateReceipt ? 20 : 4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(15,23,42,0.18)",
                    transition: "left 200ms",
                  }}
                />
              </div>
            </label>
          </div>

          {error ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#ffe9ec", borderRadius: 12, padding: "14px 16px", color: "#9f1239" }} role="alert">
              <AlertTriangle size={16} color="#9f1239" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{error}</p>
            </div>
          ) : null}
        </div>

        <div style={{ background: "#f2f4f6", padding: "12px 16px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 18px",
              background: "#fff",
              color: "#191c1e",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            style={{
              padding: "9px 18px",
              background: shouldGenerateReceipt ? "#002114" : "linear-gradient(135deg, #0f172a, #131b2e)",
              color: shouldGenerateReceipt ? "#85f8c4" : "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: loading ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Recording...
              </>
            ) : shouldGenerateReceipt ? (
              <>
                <Receipt size={14} />
                Record & Generate
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Record Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
