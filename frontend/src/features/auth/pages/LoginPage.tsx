import { useState } from "react";
import { AlertTriangle, Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/shared/lib/supabase";
import logoSvg from "@/shared/assets/logo.svg";

type Mode = "signin" | "signup" | "forgot_password";

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordsMismatch = mode === "signup" && confirmPassword.length > 0 && password !== confirmPassword;

  const seedEnabled = import.meta.env.VITE_SEED_ENABLED === "true";
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  const isDevShortcut = seedEnabled && email.trim() === "dev";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (isDevShortcut) {
      try {
        const res = await fetch(`${apiBase}/api/dev-token`, { method: "POST" });
        if (res.ok) {
          const { access_token, sessionId, tenantId, expiresAt } = await res.json() as {
            access_token: string;
            sessionId?: string;
            tenantId?: string;
            expiresAt?: string;
          };
          sessionStorage.setItem("dev_token", access_token);
          if (sessionId && tenantId && expiresAt) {
            sessionStorage.setItem(
              "dev_session_meta",
              JSON.stringify({ sessionId, tenantId, expiresAt })
            );
          }
          window.dispatchEvent(new Event("dev-login"));
        } else {
          setError("Dev login failed — is SEED_ENABLED=true in the backend?");
        }
      } catch {
        setError("Dev login failed — is the backend running?");
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
        setInfo("Password reset instructions sent! Check your email.");
      }
    } else if (mode === "signin") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
    } else {
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
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (authError) setError(authError.message);
    setLoading(false);
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#F5F5F5] font-sans text-slate-900 selection:bg-slate-900 selection:text-white p-4 relative">

      {/* Container Card */}
      <div className="relative w-full max-w-[450px] bg-white rounded-[16px] shadow-[0_8px_16px_rgba(0,0,0,0.06)] px-10 md:px-[50px] py-[60px] overflow-hidden">

        {/* Subtle pale gray circle accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-[#F2F2F2] to-transparent rounded-full opacity-60 pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-8 mt-2 w-full text-center">
          <h1 className="sr-only">Rent Manager</h1>
          <img src={logoSvg} alt="The Ledger Logo" className="h-12 w-auto object-contain mx-auto mb-3" />
          <p className="text-[#666666] text-[15px] font-medium tracking-wide">
            Curated property management.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[14px] font-bold text-black mb-[10px]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={20} strokeWidth={2} className="text-[#999999]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type={isDevShortcut ? "text" : "email"}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-[46px] pr-4 h-[52px] bg-[#F5F5F5] border border-transparent rounded-[8px] text-black placeholder-[#AAAAAA] font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20 focus:bg-white transition-all duration-200"
                  placeholder="manager@domain.com"
                />
              </div>
            </div>

            {/* Password Field */}
            {mode !== "forgot_password" && (
              isDevShortcut ? (
                <div className="flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] rounded-[8px] px-4 h-[52px] border border-[#A5D6A7]">
                  <span className="text-[14px] font-medium">Dev mode active</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-[10px]">
                    <label htmlFor="password" className="block text-[14px] font-bold text-black">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot_password");
                          setError(null);
                          setInfo(null);
                          setConfirmPassword("");
                        }}
                        className="text-[13px] font-semibold tracking-wide text-[#666666] hover:text-black transition-colors bg-transparent border-0 cursor-pointer p-0"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock size={20} strokeWidth={2} className="text-[#999999]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={mode === "signup" ? 6 : undefined}
                      className="w-full pl-[46px] pr-12 h-[52px] bg-[#F5F5F5] border border-transparent rounded-[8px] text-black placeholder-[#AAAAAA] text-[20px] font-mono tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20 focus:bg-white transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#999999] hover:text-[#666666] transition-colors focus:outline-none cursor-pointer bg-transparent border-0 p-0"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
                    </button>
                  </div>
                </div>
              )
            )}

            {mode === "signup" && !isDevShortcut && (
              <div>
                <label htmlFor="confirm-password" className="block text-[14px] font-bold text-black mb-[10px]">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={20} strokeWidth={2} className="text-[#999999]" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                      className={`w-full pl-[46px] pr-4 h-[52px] border rounded-[8px] text-black placeholder-[#AAAAAA] text-[20px] font-mono tracking-[0.2em] focus:outline-none transition-all duration-200 ${
                        passwordsMismatch
                          ? "bg-[#FFF5F5] border-[#EF5350] focus:ring-2 focus:ring-[#C62828]/20"
                          : "bg-[#F5F5F5] border-transparent focus:ring-2 focus:ring-[#1A1A2E]/20 focus:bg-white"
                      }`}
                    placeholder="••••••••"
                  />
                </div>
                  {passwordsMismatch && (
                    <p className="mt-2 text-[13px] font-medium text-[#C62828]" role="alert">
                      Passwords do not match.
                    </p>
                  )}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] rounded-[8px] px-4 py-3" role="alert">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p className="text-[13px] font-medium">{error}</p>
            </div>
          )}

          {info && (
            <div className="bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] rounded-[8px] px-4 py-3" role="status">
              <p className="text-[13px] font-medium">{info}</p>
            </div>
          )}

          <div className="pt-5 pb-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#17172A] hover:bg-[#000000] disabled:bg-[#17172E]/70 text-white font-bold text-[16px] tracking-wide rounded-[8px] transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
                  <ArrowRight size={20} strokeWidth={2.5} className="ml-1 text-white" />
                </>
              )}
            </button>

            {mode !== "forgot_password" && (
              <>
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-x-0 h-[1px] bg-[#E5E5E5]"></div>
                  <span className="relative bg-white px-4 text-[#999999] text-[12px] font-bold uppercase tracking-widest">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-[52px] flex items-center justify-center gap-3 bg-[#F5F5F5] border border-transparent hover:bg-[#EAEAEA] text-[#1A1A2E] font-bold text-[15px] tracking-wide rounded-[8px] transition-all duration-200 cursor-pointer disabled:opacity-50"
                  aria-label={mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
                </button>
              </>
            )}
          </div>
        </form>

        <div className="text-center relative z-10 mb-2">
          {mode === "signin" ? (
            <p className="text-[#666666] text-[14px]">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setInfo(null);
                  setConfirmPassword("");
                }}
                className="font-bold text-[#1A1A2E] hover:text-black hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                Sign Up
              </button>
            </p>
          ) : mode === "signup" ? (
            <p className="text-[#666666] text-[14px]">
              Already have access?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setInfo(null);
                  setConfirmPassword("");
                }}
                className="font-bold text-[#1A1A2E] hover:text-black hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-[#666666] text-[14px]">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setInfo(null);
                  setConfirmPassword("");
                }}
                className="font-bold text-[#1A1A2E] hover:text-black hover:underline cursor-pointer bg-transparent border-0 p-0"
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
