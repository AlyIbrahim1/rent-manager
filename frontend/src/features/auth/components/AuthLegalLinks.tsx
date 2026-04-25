import { legalLinkStyle, legalLinksDividerStyle, legalLinksRowStyle } from "./authStyles";

export function AuthLegalLinks({
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}: {
  onOpenPrivacyPolicy: () => void;
  onOpenTermsOfService: () => void;
}) {
  return (
    <div style={legalLinksRowStyle} className="ledger-auth-legal-links" aria-label="Legal links">
      <button type="button" onClick={onOpenPrivacyPolicy} style={legalLinkStyle} className="ledger-auth-legal-link">
        Privacy Policy
      </button>
      <span style={legalLinksDividerStyle} aria-hidden="true">
        •
      </span>
      <button type="button" onClick={onOpenTermsOfService} style={legalLinkStyle} className="ledger-auth-legal-link">
        Terms of Service
      </button>
    </div>
  );
}
