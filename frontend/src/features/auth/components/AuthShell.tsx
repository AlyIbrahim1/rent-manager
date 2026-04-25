import type { ReactNode } from "react";

import logoSvg from "@/shared/assets/logo.svg";

import {
  authCardGlowStyle,
  authCardStyle,
  authBelowCardStyle,
  authDescriptionStyle,
  authHeaderStyle,
  authHeadingBlockStyle,
  authLogoStyle,
  authPageColumnStyle,
  authPageStyle,
  authSectionStyle,
  authTaglineStyle,
  authTitleStyle,
  visuallyHiddenStyle,
} from "./authStyles";

export function AuthShell({
  children,
  footer,
  belowCard,
  title,
  description,
}: {
  children: ReactNode;
  footer?: ReactNode;
  belowCard?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={authPageStyle} className="ledger-auth-page">
      <div style={authPageColumnStyle} className="ledger-auth-column">
        <div style={authCardStyle} className="ledger-auth-card">
          <div style={authCardGlowStyle} />

          <div style={authHeaderStyle} className="ledger-auth-header">
            <img src={logoSvg} alt="The Ledger" style={authLogoStyle} />
            <span style={visuallyHiddenStyle}>Rent Manager</span>
            <div style={authHeadingBlockStyle}>
              <p style={authTaglineStyle}>Curated property management</p>
              <h1 style={authTitleStyle}>{title}</h1>
              <p style={authDescriptionStyle}>{description}</p>
            </div>
          </div>

          <div style={authSectionStyle}>{children}</div>
          {footer ? <div style={authSectionStyle}>{footer}</div> : null}
        </div>

        {belowCard ? <div style={authBelowCardStyle}>{belowCard}</div> : null}
      </div>
    </div>
  );
}
