import { legalLinkStyle, legalLinksDividerStyle, legalLinksRowStyle } from "./authStyles";

export function AuthLegalLinks({
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}: {
  onOpenPrivacyPolicy: () => void;
  onOpenTermsOfService: () => void;
}) {
  return (
    <div style={legalLinksRowStyle} aria-label="Legal links">
      <button type="button" onClick={onOpenPrivacyPolicy} style={legalLinkStyle}>
        Privacy Policy
      </button>
      <span style={legalLinksDividerStyle} aria-hidden="true">
        •
      </span>
      <button type="button" onClick={onOpenTermsOfService} style={legalLinkStyle}>
        Terms of Service
      </button>
    </div>
  );
}
