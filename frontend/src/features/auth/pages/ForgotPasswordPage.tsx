import { useState, type FormEvent } from "react";

import {
  AuthActions,
  AuthForm,
  EmailField,
  ErrorMessage,
  InfoMessage,
  SubmitButton,
} from "@/features/auth/components/AuthFormFields";
import { AuthLegalLinks } from "@/features/auth/components/AuthLegalLinks";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { footerLinkButtonStyle, footerTextStyle, footerWrapStyle } from "@/features/auth/components/authStyles";
import { syncAuthPath } from "@/features/auth/lib/authRoute";
import { supabase } from "@/shared/lib/supabase";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setInfo("Password reset instructions sent. Check the linked email inbox.");
    }

    setLoading(false);
  }

  return (
    <AuthShell
      title="Reset password"
      description="Request a reset link for the email connected to your workspace access."
      footer={
        <div style={footerWrapStyle}>
          <p style={footerTextStyle}>
            <button type="button" onClick={() => syncAuthPath("signin")} style={footerLinkButtonStyle}>
              Back to Sign In
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
        <EmailField value={email} onChange={setEmail} />

        {error ? <ErrorMessage message={error} /> : null}
        {info ? <InfoMessage message={info} /> : null}

        <AuthActions>
          <SubmitButton loading={loading} label="Reset Password" />
        </AuthActions>
      </AuthForm>
    </AuthShell>
  );
}
