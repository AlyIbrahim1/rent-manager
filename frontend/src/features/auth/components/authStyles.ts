import type { CSSProperties } from "react";

export const authPageStyle: CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  fontFamily: "Inter, sans-serif",
  background:
    "radial-gradient(circle at 10% 8%, rgba(236,238,240,0.92), transparent 32%), radial-gradient(circle at 88% 14%, rgba(213,227,252,0.26), transparent 28%), linear-gradient(180deg, #f7f9fb 0%, #f4f6f8 100%)",
};

export const authCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 440,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(24px)",
  borderRadius: 16,
  boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
  padding: "56px 44px",
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
  marginBottom: 28,
  position: "relative",
  zIndex: 1,
};

export const authLogoStyle: CSSProperties = {
  height: 44,
  width: "auto",
  margin: "0 auto 10px",
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
  color: "#666",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: "0.03em",
};

export const formStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};

export const fieldGroupStyle: CSSProperties = {
  marginBottom: 20,
};

export const passwordFieldGroupStyle: CSSProperties = {
  marginBottom: 28,
};

export const confirmPasswordFieldGroupStyle: CSSProperties = {
  marginBottom: 24,
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
  height: 50,
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
  marginBottom: 18,
};

export const errorBannerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  background: "#FFEBEE",
  color: "#C62828",
  borderRadius: 8,
  padding: "12px 16px",
  marginBottom: 18,
};

export const devBannerStyle: CSSProperties = {
  marginBottom: 28,
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
  paddingBottom: 20,
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
  margin: "20px 0",
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
