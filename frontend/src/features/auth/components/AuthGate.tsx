import { useEffect, useState } from "react";

import { AUTH_ROUTE_CHANGE_EVENT, getAuthModeFromPath } from "@/features/auth/lib/authRoute";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { RenterDashboardPage } from "@/features/renters/pages/RenterDashboardPage";
import type { AuthUser } from "@/shared/lib/supabase";
import { supabase } from "@/shared/lib/supabase";
import { ledgerPageShellClass } from "@/shared/ui/ledgerPrimitives";

function hasActiveDevSession() {
  const token = sessionStorage.getItem("dev_token");
  if (!token) return false;

  const rawMeta = sessionStorage.getItem("dev_session_meta");
  if (!rawMeta) return true;

  try {
    const meta = JSON.parse(rawMeta) as { expiresAt?: string };
    if (!meta.expiresAt || !Number.isFinite(Date.parse(meta.expiresAt))) {
      return true;
    }
    if (Date.now() >= Date.parse(meta.expiresAt)) {
      sessionStorage.removeItem("dev_token");
      sessionStorage.removeItem("dev_session_meta");
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

function useAuthSession() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (hasActiveDevSession()) {
      setUser({ id: "dev", email: "dev@local" });
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u ? { id: u.id, email: u.email } : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u ? { id: u.id, email: u.email } : null);
    });

    const onDevLogin = () => {
      setUser({ id: "dev", email: "dev@local" });
    };

    window.addEventListener("dev-login", onDevLogin);
    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("dev-login", onDevLogin);
    };
  }, []);

  return { user, loading };
}

function useAuthRouteMode() {
  const [mode, setMode] = useState(() => getAuthModeFromPath(window.location.pathname));

  useEffect(() => {
    const syncMode = () => {
      setMode(getAuthModeFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", syncMode);
    window.addEventListener(AUTH_ROUTE_CHANGE_EVENT, syncMode);
    return () => {
      window.removeEventListener("popstate", syncMode);
      window.removeEventListener(AUTH_ROUTE_CHANGE_EVENT, syncMode);
    };
  }, []);

  return mode;
}

export function AuthGate() {
  const { user, loading } = useAuthSession();
  const authRouteMode = useAuthRouteMode();

  if (loading) {
    return (
      <div className={`${ledgerPageShellClass} flex items-center justify-center`}>
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    if (authRouteMode === "signup") {
      return <SignupPage />;
    }

    if (authRouteMode === "forgot_password") {
      return <ForgotPasswordPage />;
    }

    return <LoginPage />;
  }
  return <RenterDashboardPage user={user} />;
}
