import type { CSSProperties } from "react";

export const authPageStyle: CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px 16px",
  fontFamily: "Inter, sans-serif",
  background:
    "radial-gradient(circle at 10% 8%, rgba(236,238,240,0.92), transparent 32%), radial-gradient(circle at 88% 14%, rgba(213,227,252,0.26), transparent 28%), linear-gradient(180deg, #f7f9fb 0%, #f4f6f8 100%)",
};

export const authPageColumnStyle: CSSProperties = {
  width: "100%",
  maxWidth: 452,
  display: "grid",
  gap: 18,
};

export const authCardStyle: CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(24px)",
  borderRadius: 16,
  boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
  padding: "clamp(2.25rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 2.75rem) clamp(1.75rem, 3vw, 2.25rem)",
  position: "relative",
  overflow: "hidden",
};

export const authCardGlowStyle: CSSProperties = {
  position: "absolute",
  top: -48,
  right: -48,
  width: 192,
  height: 192,
  background: "radial-gradient(circle, #F2F2F2, transparent)",
  borderRadius: "50%",
  opacity: 0.6,
  pointerEvents: "none",
};

export const authSectionStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

export const authHeaderStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: 30,
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: 14,
};

export const authLogoStyle: CSSProperties = {
  height: 44,
  width: "auto",
  margin: "0 auto",
  display: "block",
};

export const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
};

export const authTaglineStyle: CSSProperties = {
  margin: 0,
  color: "#6A6D76",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

export const authHeadingBlockStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "center",
};

export const authTitleStyle: CSSProperties = {
  margin: 0,
  color: "#191c1e",
  fontFamily: '"Manrope", "Inter", sans-serif',
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 700,
};

export const authDescriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: "38ch",
  color: "#5C606B",
  fontSize: 14,
  lineHeight: 1.6,
};

export const formStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

export const fieldGroupStyle: CSSProperties = {
  marginBottom: 18,
};

export const passwordFieldGroupStyle: CSSProperties = {
  marginBottom: 24,
};

export const confirmPasswordFieldGroupStyle: CSSProperties = {
  marginBottom: 20,
};

export const fieldLabelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#000",
  marginBottom: 8,
};

export const fieldLabelRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};

export const fieldWrapStyle: CSSProperties = {
  position: "relative",
};

export const leadingIconStyle: CSSProperties = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
};

export const trailingIconButtonStyle: CSSProperties = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#999",
  padding: 0,
};

export const inlineActionButtonStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#666",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  padding: 0,
};

export const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  paddingLeft: 44,
  paddingRight: 16,
  height: 52,
  background: "#F5F5F5",
  border: "1px solid transparent",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 500,
  color: "#000",
  outline: "none",
  fontFamily: "inherit",
  transition: "all 200ms",
};

export const passwordInputStyle: CSSProperties = {
  ...inputStyle,
  paddingRight: 44,
  fontSize: 20,
  fontFamily: "monospace",
  letterSpacing: "0.2em",
};

export const successBannerStyle: CSSProperties = {
  background: "#E8F5E9",
  color: "#2E7D32",
  borderRadius: 8,
  padding: "12px 16px",
  marginBottom: 16,
};

export const errorBannerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  background: "#FFEBEE",
  color: "#C62828",
  borderRadius: 8,
  padding: "12px 16px",
  marginBottom: 16,
};

export const devBannerStyle: CSSProperties = {
  marginBottom: 24,
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#E8F5E9",
  color: "#2E7D32",
  borderRadius: 8,
  padding: "14px 16px",
  fontSize: 14,
  fontWeight: 500,
};

export const helperErrorTextStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: 13,
  fontWeight: 500,
  color: "#C62828",
};

export const actionsWrapStyle: CSSProperties = {
  marginTop: 8,
};

export const primaryButtonStyle: CSSProperties = {
  width: "100%",
  height: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "linear-gradient(135deg, #0f172a, #131b2e)",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: "0.03em",
  border: "none",
  borderRadius: 8,
  fontFamily: "inherit",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: "all 200ms",
};

export const dividerWrapStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "18px 0",
};

export const dividerLineStyle: CSSProperties = {
  position: "absolute",
  inset: "50% 0 auto",
  height: 1,
  background: "#E5E5E5",
};

export const dividerTextStyle: CSSProperties = {
  position: "relative",
  background: "rgba(255,255,255,0.85)",
  padding: "0 14px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#999",
};

export const googleButtonStyle: CSSProperties = {
  width: "100%",
  height: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  background: "#F5F5F5",
  border: "1px solid transparent",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  color: "#1A1A2E",
  fontFamily: "inherit",
  transition: "background 200ms",
};

export const footerWrapStyle: CSSProperties = {
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  marginTop: 24,
};

export const footerTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#666",
};

export const footerLinkButtonStyle: CSSProperties = {
  fontWeight: 700,
  color: "#1A1A2E",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 13,
  padding: 0,
};

export const legalLinksRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 12,
};

export const legalLinkStyle: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  color: "#616779",
  fontFamily: "inherit",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

export const legalLinksDividerStyle: CSSProperties = {
  color: "#C7CCD4",
  fontSize: 11,
  fontWeight: 700,
};

export const legalNoticeStyle: CSSProperties = {
  margin: "6px auto 0",
  maxWidth: "33ch",
  color: "#7A808E",
  fontSize: 12,
  lineHeight: 1.6,
  textAlign: "center",
};

export const authBelowCardStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  paddingTop: 2,
};

export const legalDocumentCardStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  background: "#FFFFFF",
  borderRadius: 14,
  padding: "28px 28px 10px",
};

export const legalModalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "rgba(15,23,42,0.50)",
  backdropFilter: "blur(2px)",
};

export const legalModalStyle: CSSProperties = {
  width: "100%",
  maxWidth: 656,
  maxHeight: "min(86dvh, 920px)",
  overflow: "hidden",
  borderRadius: 28,
  background: "#FFFFFF",
  boxShadow: "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
};

export const legalHeaderStyle: CSSProperties = {
  padding: "24px 32px 22px",
  background: "#f2f4f6",
  position: "relative",
};

export const legalBackButtonStyle: CSSProperties = {
  position: "absolute",
  top: 18,
  right: 20,
  background: "none",
  border: "none",
  width: 32,
  height: 32,
  borderRadius: 10,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#4B5563",
  fontFamily: "inherit",
  cursor: "pointer",
  transition: "background 180ms var(--ease-out-quart), transform 180ms var(--ease-out-quart)",
};

export const legalModalBodyStyle: CSSProperties = {
  padding: "0 12px 12px",
  overflowY: "auto",
  maxHeight: "calc(min(86dvh, 920px) - 200px)",
  background: "#f2f4f6",
};

export const legalDocumentEyebrowStyle: CSSProperties = {
  margin: "0 0 10px",
  color: "#76777d",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

export const legalDocumentTitleStyle: CSSProperties = {
  margin: "0 0 10px",
  color: "#111111",
  fontFamily: '"Manrope", "Inter", sans-serif',
  fontSize: 29,
  lineHeight: 1.08,
  fontWeight: 700,
  paddingRight: 40,
};

export const legalDocumentUpdatedStyle: CSSProperties = {
  margin: 0,
  color: "#5F636D",
  fontSize: 13,
  lineHeight: 1.55,
  maxWidth: "58ch",
};

export const legalDocumentIntroStyle: CSSProperties = {
  display: "inline",
};

export const legalSectionStyle: CSSProperties = {
  marginTop: 0,
};

export const legalSectionTitleStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "#111111",
  fontFamily: '"Manrope", "Inter", sans-serif',
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.3,
};

export const legalSectionBodyStyle: CSSProperties = {
  margin: 0,
  color: "#474B55",
  fontSize: 14,
  lineHeight: 1.75,
};

export const legalFooterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "16px 24px 22px",
  background: "#f2f4f6",
};
