import type { ReactNode } from "react";

import logoSvg from "@/shared/assets/logo.svg";

import {
  authCardGlowStyle,
  authCardStyle,
  authHeaderStyle,
  authLogoStyle,
  authPageStyle,
  authSectionStyle,
  authTaglineStyle,
  visuallyHiddenStyle,
} from "./authStyles";

export function AuthShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div style={authPageStyle}>
      <div style={authCardStyle}>
        <div style={authCardGlowStyle} />

        <div style={authHeaderStyle}>
          <img src={logoSvg} alt="The Ledger" style={authLogoStyle} />
          <span style={visuallyHiddenStyle}>Rent Manager</span>
          <p style={authTaglineStyle}>Curated property management.</p>
        </div>

        <div style={authSectionStyle}>{children}</div>
        {footer ? <div style={authSectionStyle}>{footer}</div> : null}
      </div>
    </div>
  );
}
