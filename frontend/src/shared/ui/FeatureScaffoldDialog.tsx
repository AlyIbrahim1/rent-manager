import { useEffect, useId } from "react";
import { Bell, CircleHelp, Settings, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MODAL_EXIT_DURATION_MS,
  floatingSurfaceLowestStyle,
  modalBackdropClass,
  modalFlowClass,
  modalPopClass,
  modalPrimaryButtonClass,
  modalPrimaryButtonStyle,
  modalShellClass,
} from "@/shared/ui/modalActionStyles";
import { useAnimatedPresence } from "@/shared/ui/useAnimatedPresence";

export type FeatureScaffoldConfig = {
  key: "notifications" | "profile" | "settings" | "support";
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
};

const featureIcons: Record<FeatureScaffoldConfig["key"], LucideIcon> = {
  notifications: Bell,
  profile: UserRound,
  settings: Settings,
  support: CircleHelp,
};

type FeatureScaffoldDialogProps = {
  feature: FeatureScaffoldConfig | null;
  onClose: () => void;
};

export function FeatureScaffoldDialog({ feature, onClose }: FeatureScaffoldDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const isOpen = Boolean(feature);
  const { isMounted, state } = useAnimatedPresence(isOpen, MODAL_EXIT_DURATION_MS);

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

  if (!isMounted || !feature) {
    return null;
  }

  const Icon = featureIcons[feature.key];

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-[2px] ${modalBackdropClass}`}
      data-state={state}
      onClick={(event) => {
        if (event.target === event.currentTarget && isOpen) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-state={state}
        className={`w-full max-w-[29rem] overflow-hidden rounded-[1.6rem] bg-surface-container-lowest shadow-modal ${modalShellClass} ${modalFlowClass}`}
        style={floatingSurfaceLowestStyle}
      >
        <div className="bg-surface-container-low px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <span
              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface ${modalPopClass}`}
              data-state={state}
            >
              <Icon size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                {feature.eyebrow}
              </p>
              <h2 id={titleId} className="mt-2 font-heading text-[1.65rem] font-bold leading-none text-on-surface">
                {feature.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <p id={descriptionId} className="max-w-[38ch] text-[0.98rem] leading-8 text-on-surface-muted">
            {feature.description}
          </p>

          <div className="space-y-2 rounded-md bg-surface-container-low px-4 py-4">
            {feature.highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <p className="text-sm leading-7 text-on-surface">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={modalPrimaryButtonClass}
              style={modalPrimaryButtonStyle}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
