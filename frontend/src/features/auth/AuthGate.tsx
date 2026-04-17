import { useEffect, useState } from "react";

import { LoginPage } from "./LoginPage";
import { RenterDashboardPage } from "../renters/RenterDashboardPage";
import type { AuthUser } from "../../lib/supabase";
import { supabase } from "../../lib/supabase";

function useAuthSession() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Seed from current session on mount
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u ? { id: u.id, email: u.email } : null);
      setLoading(false);
    });

    // React to sign-in / sign-out events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u ? { id: u.id, email: u.email } : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function AuthGate() {
  const { user, loading } = useAuthSession();

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage />;
  return <RenterDashboardPage />;
}
