import type { CSSProperties } from "react";

export const MODAL_EXIT_DURATION_MS = 220;
export const modalBackdropClass = "modal-backdrop-motion";
export const modalShellClass = "modal-shell-motion";
export const modalFlowClass = "modal-flow-motion";
export const modalPopClass = "modal-pop-motion";
export const modalSheetBackdropClass = "modal-sheet-backdrop-motion";
export const modalSheetPanelClass = "modal-sheet-panel-motion";

export const modalSecondaryButtonClass =
  "inline-flex h-11 items-center justify-center rounded-[6px] px-7 text-[14px] font-semibold text-on-surface shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-[#e8e8e8] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.985] active:bg-[#e2e2e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#efefef] disabled:hover:shadow-[0_1px_2px_rgba(15,23,42,0.05)]";

export const modalPrimaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[6px] px-6 text-[14px] font-semibold text-on-primary shadow-[0_1px_2px_rgba(15,23,42,0.18)] transition-[filter,box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:brightness-[1.04] hover:shadow-[0_12px_24px_rgba(15,23,42,0.14)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:brightness-100 disabled:hover:shadow-[0_1px_2px_rgba(15,23,42,0.18)]";

export const modalSecondaryButtonStyle: CSSProperties = {
  backgroundColor: "#e6e8ea",
};

export const modalPrimaryButtonStyle: CSSProperties = {
  backgroundColor: "#0f172a",
  backgroundImage: "linear-gradient(135deg, #0f172a 0%, #131b2e 100%)",
  color: "#ffffff",
};

// Floating UI shells need an explicit solid background so they stay opaque in production overlays.
export const floatingSurfaceLowestStyle: CSSProperties = {
  backgroundColor: "#ffffff",
};

export const floatingSurfaceLowStyle: CSSProperties = {
  backgroundColor: "#f2f4f6",
};

export const floatingSurfaceBaseStyle: CSSProperties = {
  backgroundColor: "#f7f9fb",
};
