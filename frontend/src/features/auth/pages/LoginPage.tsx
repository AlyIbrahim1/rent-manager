import { useEffect, useState, type FormEvent } from "react";

import {
  AuthActions,
  AuthForm,
  DevModeBanner,
  EmailField,
  ErrorMessage,
  GoogleButton,
  InfoMessage,
  InlineActionButton,
  PasswordField,
  SocialDivider,
  SubmitButton,
} from "@/features/auth/components/AuthFormFields";
import { AuthLegalLinks } from "@/features/auth/components/AuthLegalLinks";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { footerLinkButtonStyle, footerTextStyle, footerWrapStyle } from "@/features/auth/components/authStyles";
import { consumeAuthFlashMessage, syncAuthPath } from "@/features/auth/lib/authRoute";
import { supabase } from "@/shared/lib/supabase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const seedEnabled = import.meta.env.VITE_SEED_ENABLED === "true";
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  const isDevShortcut = seedEnabled && email.trim() === "dev";

  useEffect(() => {
    setInfo(consumeAuthFlashMessage());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError(null);
    setInfo(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  }

  return (
    <AuthShell
      title="Sign in to the ledger"
      description="Review portfolio health, renter balances, and payment activity from one calm workspace."
      footer={
        <div style={footerWrapStyle}>
          <p style={footerTextStyle}>
            Don't have an account?{" "}
            <button type="button" onClick={() => syncAuthPath("signup")} style={footerLinkButtonStyle}>
              Sign Up
            </button>
          </p>
        </div>
      }
      belowCard={
        <AuthLegalLinks
          onOpenPrivacyPolicy={() => window.dispatchEvent(new CustomEvent("open-privacy-policy"))}
          onOpenTermsOfService={() => window.dispatchEvent(new CustomEvent("open-terms-of-service"))}
        />
      }
    >
      <AuthForm onSubmit={handleSubmit}>
        <EmailField value={email} onChange={setEmail} type={isDevShortcut ? "text" : "email"} />

        {isDevShortcut ? (
          <DevModeBanner />
        ) : (
          <PasswordField
            value={password}
            onChange={setPassword}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword((value) => !value)}
            autoComplete="current-password"
            headerAction={<InlineActionButton onClick={() => syncAuthPath("forgot_password")}>Forgot Password?</InlineActionButton>}
          />
        )}

        {error ? <ErrorMessage message={error} /> : null}
        {info ? <InfoMessage message={info} /> : null}

        <AuthActions>
          <SubmitButton loading={loading} label="Sign In" />
          <SocialDivider />
          <GoogleButton loading={loading} label="Sign in with Google" onClick={handleGoogleSignIn} />
        </AuthActions>
      </AuthForm>
    </AuthShell>
  );
}
