import { useEffect, useId } from "react";
import { Bell, CircleHelp, Settings, UserRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { MODAL_EXIT_DURATION_MS, modalBackdropClass, modalShellClass } from "@/shared/ui/modalActionStyles";
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
      className={modalBackdropClass}
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
        className={modalShellClass}
        data-state={state}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
        }}
      >
        <div style={{ background: "#f2f4f6", padding: "22px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div id={titleId} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 16, background: "#eceef0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} color="#191c1e" />
            </span>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>{feature.eyebrow}</p>
              <h2 style={{ margin: "10px 0 0", fontFamily: "Manrope, sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#191c1e", lineHeight: 1.1 }}>
                {feature.title}
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#45464d", lineHeight: 1.5 }}>{feature.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss dialog"
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
          <div id={descriptionId} style={{ background: "#fff", borderRadius: 22, padding: "18px 20px", boxShadow: "0 12px 40px rgba(25,28,30,0.06)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {feature.highlights.map((highlight) => (
                <div key={highlight} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      marginTop: 8,
                      borderRadius: "50%",
                      background: "#191c1e",
                      flexShrink: 0,
                    }}
                  />
                  <p style={{ margin: 0, fontSize: 13, color: "#191c1e", lineHeight: 1.65 }}>{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#f2f4f6", padding: "12px 16px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 18px",
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
