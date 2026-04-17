import { useState } from "react";
import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Mode = "signin" | "signup";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}


export function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

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
          const { access_token } = await res.json() as { access_token: string };
          sessionStorage.setItem("dev_token", access_token);
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

    if (mode === "signin") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
    } else {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        setInfo("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
        setPassword("");
      }
    }

    setLoading(false);
  }

  async function handleOAuth() {
    setError(null);
    setOauthLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (authError) {
      setError(authError.message);
      setOauthLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-slate-900 leading-tight">Rent Manager</h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === "signin" ? "Sign in to your workspace" : "Create your workspace"}
          </p>
        </div>

        {/* OAuth buttons */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => handleOAuth()}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-medium py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {oauthLoading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs font-medium">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type={isDevShortcut ? "text" : "email"}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          {isDevShortcut ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <span className="text-amber-700 text-sm font-medium">Dev mode — will sign in with sample data</span>
            </div>
          ) : (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {info && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3" role="status">
              <p className="text-green-700 text-sm">{info}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {mode === "signin" ? "Signing in…" : "Creating account…"}
              </>
            ) : (
              mode === "signin" ? "Sign in" : "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
