import { useEffect, useId } from "react";
import { Loader2, LogOut } from "lucide-react";
import {
  MODAL_EXIT_DURATION_MS,
  floatingSurfaceLowestStyle,
  modalBackdropClass,
  modalFlowClass,
  modalPopClass,
  modalPrimaryButtonClass,
  modalPrimaryButtonStyle,
  modalSecondaryButtonClass,
  modalSecondaryButtonStyle,
  modalShellClass,
} from "@/shared/ui/modalActionStyles";
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
  description = "Are you sure you want to sign out of your session? Any unsaved changes to ledgers or tenant profiles may be lost.",
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
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-[2px] ${modalBackdropClass}`}
      data-state={state}
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
        data-state={state}
        className={`w-full max-w-[24.5rem] overflow-hidden rounded-[1.6rem] bg-surface-container-lowest shadow-modal ${modalShellClass} ${modalFlowClass}`}
        style={floatingSurfaceLowestStyle}
      >
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffe9ec] text-[#be123c] ${modalPopClass}`} data-state={state}>
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
              className={modalSecondaryButtonClass}
              style={modalSecondaryButtonStyle}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={modalPrimaryButtonClass}
              style={modalPrimaryButtonStyle}
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
