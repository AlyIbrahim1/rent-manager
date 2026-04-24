import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cx } from "@/shared/ui/cx";

export const ledgerPageShellClass =
  "relative min-h-dvh overflow-hidden bg-surface text-on-surface selection:bg-primary selection:text-on-primary";

export const ledgerPageGutterClass = "px-4 sm:px-6 lg:px-10";

export const ledgerSectionShellClass =
  "rounded-[1.55rem] bg-surface-container-low p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6";

export const ledgerPanelClass =
  "rounded-[1.35rem] bg-surface-container-lowest p-5 shadow-layer sm:p-6";

export const ledgerInsetPanelClass =
  "rounded-[1.2rem] bg-surface-container px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]";

export const ledgerCardInteractiveClass =
  "rounded-[1.35rem] bg-surface-container-lowest shadow-layer transition-[background-color,transform,box-shadow] duration-300 hover:scale-[1.01] hover:bg-surface-bright hover:shadow-[0_18px_48px_rgba(25,28,30,0.08)]";

export const ledgerPrimaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary shadow-[0_1px_2px_rgba(15,23,42,0.18)] transition-[opacity,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:opacity-95 hover:shadow-[0_14px_30px_rgba(15,23,42,0.14)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[0_1px_2px_rgba(15,23,42,0.18)]";

export const ledgerSecondaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-surface-container-high px-4 py-2.5 text-sm font-semibold text-on-surface shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-surface-container hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60";

export const ledgerTertiaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-tertiary-container px-4 py-2.5 text-sm font-semibold text-tertiary-fixed shadow-[0_1px_2px_rgba(0,33,20,0.22)] transition-[opacity,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:opacity-95 hover:shadow-[0_12px_24px_rgba(0,33,20,0.16)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60";

export const ledgerIconButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-transparent text-on-surface-muted transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:bg-surface-container-high hover:text-on-surface hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low disabled:cursor-not-allowed disabled:opacity-50";

export const ledgerMetadataClass =
  "text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted";

export const ledgerLabelClass =
  "mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-on-surface-muted";

export const ledgerInputClass =
  "w-full rounded-xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface shadow-[inset_0_0_0_1px_rgba(198,198,205,0.12)] transition-[background-color,box-shadow,transform] duration-200 placeholder:text-on-surface-muted/55 focus:bg-primary-fixed/65 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:[box-shadow:inset_0_0_0_1px_rgba(15,23,42,0.18),0_0_0_4px_rgba(15,23,42,0.06)]";

export const ledgerFieldHintClass = "mt-2 text-sm leading-6 text-on-surface-muted";

export const ledgerAuthActionTextClass = "text-sm text-on-surface-muted";

export function LedgerStatusChip({
  tone = "muted",
  className,
  children,
}: {
  tone?: "muted" | "success" | "active" | "error" | "unit";
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "success"
      ? "bg-success-container text-success-foreground"
      : tone === "active"
        ? "bg-tertiary-container text-tertiary-fixed"
        : tone === "error"
          ? "bg-error-soft text-error-foreground"
          : tone === "unit"
            ? "bg-surface-container-high text-on-surface"
            : "bg-surface-container-high text-on-surface-muted";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LedgerField({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={ledgerLabelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className={cx(ledgerFieldHintClass, error ? "text-error-strong" : undefined)}>{hint}</p> : null}
      {!hint && error ? <p className="mt-2 text-sm text-error-strong">{error}</p> : null}
    </div>
  );
}

export function LedgerSectionIntro({
  eyebrow,
  title,
  description,
  icon: Icon,
  iconTone = "surface",
  animatedState,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconTone?: "surface" | "tertiary" | "error";
  animatedState?: "open" | "closed";
}) {
  const iconToneClass =
    iconTone === "tertiary"
      ? "bg-tertiary-container text-tertiary-fixed"
      : iconTone === "error"
        ? "bg-error-soft text-error-strong"
        : "bg-surface-container text-on-surface";

  return (
    <div className="flex items-start gap-4">
      {Icon ? (
        <span
          className={cx(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            iconToneClass,
            animatedState ? "modal-pop-motion" : undefined,
          )}
          data-state={animatedState}
        >
          <Icon size={18} />
        </span>
      ) : null}
      <div className="min-w-0">
        {eyebrow ? <p className={ledgerMetadataClass}>{eyebrow}</p> : null}
        <h2 className="mt-2 font-heading text-[1.7rem] font-bold leading-[1.02] text-on-surface sm:text-[1.9rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[42ch] text-sm leading-7 text-on-surface-muted">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function LedgerAuthShell({
  logoSrc,
  eyebrow,
  title,
  description,
  footer,
  children,
}: {
  logoSrc: string;
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={ledgerPageShellClass}>
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute left-[-8rem] top-[-5rem] h-[19rem] w-[19rem] rounded-full bg-[radial-gradient(circle,_rgba(236,238,240,0.95)_0%,_rgba(236,238,240,0)_70%)]" />
        <div className="absolute right-[-6rem] top-[5rem] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,_rgba(213,227,252,0.5)_0%,_rgba(213,227,252,0)_72%)]" />
        <div className="absolute bottom-[-8rem] left-1/2 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(230,232,234,0.85)_0%,_rgba(230,232,234,0)_72%)]" />
      </div>

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
        <div className="w-full max-w-[31rem] overflow-hidden rounded-[1.75rem] bg-white/88 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-[24px]">
          <div className="bg-surface-container-low px-8 py-8 sm:px-10">
            <img src={logoSrc} alt="The Ledger" className="h-11 w-auto" />
            <span className="sr-only">Rent Manager</span>
            <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-on-surface-muted">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-[2.5rem] font-bold leading-[0.96] text-on-surface sm:text-[2.9rem]">
              {title}
            </h1>
            <p className="mt-4 max-w-[34ch] text-sm leading-7 text-on-surface-muted">{description}</p>
          </div>

          <div className="bg-surface-container-lowest px-8 py-8 sm:px-10">
            {children}
            {footer ? <div className="mt-8 text-center">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ledgerModalToneLowStyle: CSSProperties = {
  backgroundColor: "#f2f4f6",
};

export const ledgerModalToneLowestStyle: CSSProperties = {
  backgroundColor: "#ffffff",
};
