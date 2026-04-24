import { useState } from "react";
import { AlertTriangle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import logoSvg from "@/shared/assets/logo.svg";
import { supabase } from "@/shared/lib/supabase";

type Mode = "signin" | "signup" | "forgot_password";

function getTitle(mode: Mode) {
  if (mode === "signup") {
    return "Create Account";
  }

  if (mode === "forgot_password") {
    return "Reset Password";
  }

  return "Sign In";
}

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const seedEnabled = import.meta.env.VITE_SEED_ENABLED === "true";
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  const isDevShortcut = seedEnabled && email.trim() === "dev";
  const passwordsMismatch = mode === "signup" && confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (isDevShortcut) {
      try {
        const response = await fetch(`${apiBase}/api/dev-token`, { method: "POST" });
        if (!response.ok) {
          setError("Dev login failed. Confirm the backend is running with seed mode enabled.");
        } else {
          const { access_token, sessionId, tenantId, expiresAt } = (await response.json()) as {
            access_token: string;
            sessionId?: string;
            tenantId?: string;
            expiresAt?: string;
          };
          sessionStorage.setItem("dev_token", access_token);
          if (sessionId && tenantId && expiresAt) {
            sessionStorage.setItem("dev_session_meta", JSON.stringify({ sessionId, tenantId, expiresAt }));
          }
          window.dispatchEvent(new Event("dev-login"));
        }
      } catch {
        setError("Dev login failed. Confirm the backend is reachable.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "forgot_password") {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (authError) {
        setError(authError.message);
      } else {
        setInfo("Password reset instructions sent. Check the linked email inbox.");
      }
      setLoading(false);
      return;
    }

    if (mode === "signin") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setError(authError.message);
    } else {
      setInfo("Account created! Check your email to confirm, then sign in.");
      setMode("signin");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
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

  const passwordStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: 44,
    fontSize: 20,
    fontFamily: "monospace",
    letterSpacing: "0.2em",
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "Inter, sans-serif",
        background:
          "radial-gradient(circle at 10% 8%, rgba(236,238,240,0.92), transparent 32%), radial-gradient(circle at 88% 14%, rgba(213,227,252,0.26), transparent 28%), linear-gradient(180deg, #f7f9fb 0%, #f4f6f8 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px)",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(25,28,30,0.06)",
          padding: "56px 44px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -48,
            right: -48,
            width: 192,
            height: 192,
            background: "radial-gradient(circle, #F2F2F2, transparent)",
            borderRadius: "50%",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: 28, position: "relative", zIndex: 1 }}>
          <img src={logoSvg} alt="The Ledger" style={{ height: 44, width: "auto", margin: "0 auto 10px", display: "block" }} />
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Rent Manager</span>
          <p style={{ margin: 0, color: "#666", fontSize: 14, fontWeight: 500, letterSpacing: "0.03em" }}>
            Curated property management.
          </p>
        </div>

        <form style={{ position: "relative", zIndex: 1 }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 8 }} htmlFor="email">
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <Mail size={18} color="#999" />
              </span>
              <input
                id="email"
                name="email"
                type={isDevShortcut ? "text" : "email"}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="manager@domain.com"
                style={inputStyle}
                aria-label="Email address"
              />
            </div>
          </div>

          {mode !== "forgot_password" ? (
            isDevShortcut ? (
              <div
                style={{
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
                }}
              >
                Dev mode active
              </div>
            ) : (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#000" }} htmlFor="password">
                    Password
                  </label>
                  {mode === "signin" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot_password");
                        setError(null);
                        setInfo(null);
                      }}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#666",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        padding: 0,
                      }}
                    >
                      Forgot Password?
                    </button>
                  ) : null}
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <Lock size={18} color="#999" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={mode === "signup" ? 6 : undefined}
                    placeholder="••••••••"
                    style={passwordStyle}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#999",
                      padding: 0,
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye size={18} color="#999" /> : <EyeOff size={18} color="#999" />}
                  </button>
                </div>
              </div>
            )
          ) : null}

          {mode === "signup" && !isDevShortcut ? (
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 8 }} htmlFor="confirm-password">
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Lock size={18} color="#999" />
                </span>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    ...passwordStyle,
                    border: passwordsMismatch ? "1px solid #EF5350" : "1px solid transparent",
                    background: passwordsMismatch ? "#FFF5F5" : "#F5F5F5",
                  }}
                />
              </div>
              {passwordsMismatch ? (
                <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 500, color: "#C62828" }}>Passwords do not match.</p>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                background: "#FFEBEE",
                color: "#C62828",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 18,
              }}
            >
              <AlertTriangle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{error}</p>
            </div>
          ) : null}

          {info ? (
            <div
              role="status"
              style={{
                background: "#E8F5E9",
                color: "#2E7D32",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 18,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{info}</p>
            </div>
          ) : null}

          <div style={{ paddingBottom: 20 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
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
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 200ms",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" color="#fff" />
                  Processing...
                </>
              ) : (
                <>
                  {getTitle(mode)}
                  <ArrowRight size={18} color="#fff" />
                </>
              )}
            </button>

            {mode !== "forgot_password" ? (
              <>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0" }}>
                  <div style={{ position: "absolute", inset: "50% 0 auto", height: 1, background: "#E5E5E5" }} />
                  <span
                    style={{
                      position: "relative",
                      background: "rgba(255,255,255,0.85)",
                      padding: "0 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#999",
                    }}
                  >
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  aria-label={mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
                  style={{
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
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "background 200ms",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
                </button>
              </>
            ) : null}
          </div>
        </form>

        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {mode === "signin" ? (
            <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setInfo(null);
                  setConfirmPassword("");
                }}
                style={{
                  fontWeight: 700,
                  color: "#1A1A2E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                Sign Up
              </button>
            </p>
          ) : mode === "signup" ? (
            <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setInfo(null);
                  setConfirmPassword("");
                }}
                style={{
                  fontWeight: 700,
                  color: "#1A1A2E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                Back to Sign In
              </button>
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setInfo(null);
                }}
                style={{
                  fontWeight: 700,
                  color: "#1A1A2E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
