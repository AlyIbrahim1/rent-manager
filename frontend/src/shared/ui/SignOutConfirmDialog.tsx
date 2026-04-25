import { useEffect, useId } from "react";
import { Loader2, LogOut, X } from "lucide-react";

import { MODAL_EXIT_DURATION_MS, modalBackdropClass, modalShellClass } from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

type SignOutConfirmDialogProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

export function SignOutConfirmDialog({
  isOpen,
  isSubmitting,
  onCancel,
  onConfirm,
  title = "Sign Out",
  description = "Are you sure you want to sign out of this session? Unsaved workspace changes may be lost.",
  cancelLabel = "Cancel",
  confirmLabel = "Sign Out",
}: SignOutConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { isMounted, state } = useAnimatedPresence(isOpen, MODAL_EXIT_DURATION_MS);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isSubmitting) {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMounted, isOpen, isSubmitting, onCancel]);

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

  return (
    <div
      className={`${modalBackdropClass} ledger-responsive-dialog-overlay`}
      data-state={state}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,0.50)",
        backdropFilter: "blur(2px)",
        padding: 24,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && isOpen && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`${modalShellClass} ledger-responsive-dialog`}
        data-state={state}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
        }}
      >
        <div className="ledger-responsive-dialog-header" style={{ background: "#f2f4f6", padding: "22px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div id={titleId} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 16, background: "#ffe9ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <LogOut size={16} color="#9f1239" />
            </span>
            <div>
              <h2 style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.1 }}>
                {title}
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d", lineHeight: 1.5 }}>{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "transparent",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#45464d",
              opacity: isSubmitting ? 0.45 : 1,
            }}
          >
            <X size={17} color="#45464d" />
          </button>
        </div>

        <div id={descriptionId} className="ledger-responsive-dialog-body" style={{ background: "#f2f4f6", padding: "12px 14px" }}>
          <div className="ledger-responsive-dialog-section" style={{ background: "#fff", borderRadius: 22, padding: "18px 20px", boxShadow: "0 12px 40px rgba(25,28,30,0.06)" }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#45464d" }}>
              Session action
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "#191c1e", lineHeight: 1.65 }}>
              This will end the current workspace session and return the app to the Ledger sign-in screen.
            </p>
          </div>
        </div>

        <div className="ledger-responsive-dialog-footer" style={{ background: "#f2f4f6", padding: "12px 16px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: "9px 18px",
              background: "#fff",
              color: "#191c1e",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              padding: "9px 18px",
              background: "linear-gradient(135deg, #0f172a, #131b2e)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 4,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: isSubmitting ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing out...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
