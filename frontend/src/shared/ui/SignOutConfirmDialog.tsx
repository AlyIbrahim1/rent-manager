import { useEffect, useId } from "react";
import { Loader2, LogOut } from "lucide-react";

const dialogShellStyle = { backgroundColor: "#ffffff" } as const;
const secondaryButtonClass =
  "inline-flex h-[52px] items-center justify-center rounded-[8px] px-5 text-[15px] font-bold text-on-surface shadow-[0_4px_12px_rgba(25,28,30,0.06)] transition-all duration-200 hover:brightness-[1.02] hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";
const primaryButtonClass =
  "inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] px-5 text-[16px] font-bold tracking-wide text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:brightness-[1.06] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70";
const secondaryButtonStyle = { backgroundColor: "#f5f5f5" } as const;
const primaryButtonStyle = {
  backgroundColor: "#0f172a",
  backgroundImage: "linear-gradient(135deg, #0f172a 0%, #131b2e 100%)",
  color: "#ffffff",
} as const;

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
  description = "Are you sure you want to sign out of your session? Any unsaved changes to ledgers or tenant profiles may be lost.",
  cancelLabel = "Cancel",
  confirmLabel = "Sign Out",
}: SignOutConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSubmitting, onCancel]);

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="animate-modal-in w-full max-w-[24.5rem] overflow-hidden rounded-[1.6rem] bg-surface-container-lowest shadow-modal"
        style={dialogShellStyle}
      >
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffe9ec] text-[#be123c]">
              <LogOut size={18} />
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="font-heading text-[1.7rem] font-bold leading-none text-on-surface">
                {title}
              </h2>
            </div>
          </div>

          <p id={descriptionId} className="max-w-[30ch] text-[0.96rem] leading-8 text-on-surface-muted">
            {description}
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className={secondaryButtonClass}
              style={secondaryButtonStyle}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={primaryButtonClass}
              style={primaryButtonStyle}
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
    </div>
  );
}
