import { useState, type FormEvent } from "react";

import {
  AuthActions,
  AuthForm,
  EmailField,
  ErrorMessage,
  GoogleButton,
  HelperErrorText,
  PasswordField,
  SocialDivider,
  SubmitButton,
} from "@/features/auth/components/AuthFormFields";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { footerLinkButtonStyle, footerTextStyle, footerWrapStyle } from "@/features/auth/components/authStyles";
import { setAuthFlashMessage, syncAuthPath } from "@/features/auth/lib/authRoute";
import { supabase } from "@/shared/lib/supabase";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setError(authError.message);
    } else {
      setAuthFlashMessage("Account created! Check your email to confirm, then sign in.");
      syncAuthPath("signin", { replace: true });
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

  return (
    <AuthShell
      footer={
        <div style={footerWrapStyle}>
          <p style={footerTextStyle}>
            <button type="button" onClick={() => syncAuthPath("signin")} style={footerLinkButtonStyle}>
              Back to Sign In
            </button>
          </p>
        </div>
      }
    >
      <AuthForm onSubmit={handleSubmit}>
        <EmailField value={email} onChange={setEmail} />

        <PasswordField
          value={password}
          onChange={setPassword}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword((value) => !value)}
          autoComplete="new-password"
          minLength={6}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword((value) => !value)}
          autoComplete="new-password"
          minLength={6}
          style={{
            border: passwordsMismatch ? "1px solid #EF5350" : "1px solid transparent",
            background: passwordsMismatch ? "#FFF5F5" : "#F5F5F5",
          }}
        />

        {passwordsMismatch ? <HelperErrorText message="Passwords do not match." /> : null}
        {error ? <ErrorMessage message={error} /> : null}
        <AuthActions>
          <SubmitButton loading={loading} label="Create Account" />
          <SocialDivider />
          <GoogleButton loading={loading} label="Sign up with Google" onClick={handleGoogleSignIn} />
        </AuthActions>
      </AuthForm>
    </AuthShell>
  );
}
