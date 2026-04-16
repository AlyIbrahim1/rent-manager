import { useEffect, useState } from "react";

import { LoginPage } from "./LoginPage";
import { RenterDashboardPage } from "../renters/RenterDashboardPage";
import type { AuthUser } from "../../lib/supabase";
import { getCurrentUser } from "../../lib/supabase";

function useAuthSession() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((authUser) => {
        if (mounted) {
          setUser(authUser);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}

export function AuthGate() {
  const { user, loading } = useAuthSession();

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage />;
  return <RenterDashboardPage />;
}
