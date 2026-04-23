import { useEffect } from "react";
import { Loader2, LogOut } from "lucide-react";

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
  title = "Confirm Sign out",
  description = "End your current session on this device? You will need to sign in again to return to your dashboard.",
  cancelLabel = "Cancel",
  confirmLabel = "Yes, sign out",
}: SignOutConfirmDialogProps) {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f172a]/45 p-4 backdrop-blur-xl"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-confirm-title"
        className="animate-modal-in relative w-full max-w-lg overflow-hidden rounded-[24px] bg-surface/90 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.75)]"
      >
        <div className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-[#bfdbfe]/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-8 h-56 w-56 rounded-full bg-tertiary-fixed/30 blur-3xl" />

        <div className="relative rounded-[24px] bg-surface-container-low/85 p-5 sm:p-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-surface">
              <LogOut size={18} />
            </div>
            <div>
              <h2 id="signout-confirm-title" className="font-heading text-[1.6rem] font-bold leading-tight text-on-surface sm:text-[1.72rem]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">{description}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut size={15} />
                  {confirmLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
