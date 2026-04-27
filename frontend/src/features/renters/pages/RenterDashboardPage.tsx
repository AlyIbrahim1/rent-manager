import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, HandCoins, LayoutDashboard, Plus, Users2 } from "lucide-react";

import { AddRenterModal } from "@/features/renters/components/AddRenterModal";
import { DashboardHeader } from "@/features/renters/components/DashboardHeader";
import { DashboardSidebar } from "@/features/renters/components/DashboardSidebar";
import { MarkPaidModal } from "@/features/renters/components/MarkPaidModal";
import { PortfolioOverviewSection } from "@/features/renters/components/PortfolioOverviewSection";
import { RenterDetailsPanel } from "@/features/renters/components/RenterDetailsPanel";
import { RentersLedgerSection } from "@/features/renters/components/RentersLedgerSection";
import { api } from "@/shared/api/client";
import type { CreateRenterInput, Renter } from "@/shared/api/types";
import { supabase } from "@/shared/lib/supabase";
import type { AuthUser } from "@/shared/lib/supabase";
import { FeatureScaffoldDialog } from "@/shared/ui/FeatureScaffoldDialog";
import type { FeatureScaffoldConfig } from "@/shared/ui/FeatureScaffoldDialog";
import { SignOutConfirmDialog } from "@/shared/ui/SignOutConfirmDialog";
import logoSvg from "@/shared/assets/logo.svg";

type RenterDashboardPageProps = {
  user: AuthUser;
};

const featureScaffolds: Record<FeatureScaffoldConfig["key"], FeatureScaffoldConfig> = {
  notifications: {
    key: "notifications",
    eyebrow: "Scaffolded queue",
    title: "Notifications",
    description: "This inbox is scaffolded so payment reminders, overdue nudges, and receipt confirmations can land in a consistent dashboard surface.",
    highlights: [
      "Payment reminders and overdue renter alerts will stack here.",
      "Lease renewal and document milestones will arrive in the same queue.",
      "Future work will support filtering, read state, and direct drill-ins.",
    ],
  },
  profile: {
    key: "profile",
    eyebrow: "Scaffolded workspace view",
    title: "View Profile",
    description: "This profile surface is reserved for manager identity, workspace membership, and quick contact details when the account model expands.",
    highlights: [
      "Manager details and workspace membership will live here.",
      "Avatar upload and role metadata are reserved for this panel.",
      "Audit-friendly sign-in history can plug into the same layout.",
    ],
  },
  settings: {
    key: "settings",
    eyebrow: "Scaffolded controls",
    title: "Account Settings",
    description: "Account settings are scaffolded so preferences, notification rules, and workspace defaults can land in a real destination instead of a temporary dropdown action.",
    highlights: [
      "Notification preferences will be configurable here.",
      "Workspace defaults like currency and rent cadence fit this section.",
      "Security controls such as password reset and session review are planned.",
    ],
  },
  support: {
    key: "support",
    eyebrow: "Scaffolded assistance",
    title: "Help & Support",
    description: "Support is scaffolded as a dedicated help entry point for documentation, contact options, and guided troubleshooting when richer workflows are ready.",
    highlights: [
      "FAQ and help articles will land in this surface.",
      "Contact options for support and onboarding can be added here.",
      "Contextual troubleshooting for payments and renter imports is planned.",
    ],
  },
};

const mobileNavItems = [
  { label: "Portfolio", icon: LayoutDashboard, active: true },
  { label: "Ledger", icon: Users2, active: false },
  { label: "Payments", icon: HandCoins, active: false },
  { label: "Insight", icon: BarChart3, active: false },
] as const;

function matchesSearch(renter: Renter, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  return renter.name.toLowerCase().includes(normalizedQuery) || String(renter.appartmentNumber).includes(normalizedQuery);
}

export function RenterDashboardPage({ user }: RenterDashboardPageProps) {
  const queryClient = useQueryClient();
  const [selectedRenterId, setSelectedRenterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeFeatureScaffold, setActiveFeatureScaffold] = useState<FeatureScaffoldConfig["key"] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const rentersQuery = useQuery({
    queryKey: ["renters"],
    queryFn: api.listRenters,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRenterInput) => api.createRenter(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renters"] }),
  });

  const renters = rentersQuery.data ?? [];
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredRenters = useMemo(
    () => renters.filter((renter) => matchesSearch(renter, normalizedSearchQuery)),
    [renters, normalizedSearchQuery],
  );
  const selectedRenter = renters.find((renter) => renter.id === selectedRenterId) ?? null;
  const overdueRenters = renters.filter((renter) => (renter.rentDue ?? 0) > 0);
  const collectionRate = renters.length > 0 ? Math.round(((renters.length - overdueRenters.length) / renters.length) * 100) : 100;
  const totalMonthlyRevenue = renters.reduce((sum, renter) => sum + renter.rentAmount, 0);
  const totalDue = renters.reduce((sum, renter) => sum + Math.max(renter.rentDue ?? 0, 0), 0);

  useEffect(() => {
    if (!selectedRenterId) {
      return;
    }
    if (filteredRenters.some((renter) => renter.id === selectedRenterId)) {
      return;
    }
    setSelectedRenterId(null);
  }, [filteredRenters, selectedRenterId]);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      if (sessionStorage.getItem("dev_token")) {
        await api.deleteDevSession().catch(() => {});
        sessionStorage.removeItem("dev_token");
        sessionStorage.removeItem("dev_session_meta");
        window.location.reload();
        return;
      }

      await supabase.auth.signOut();
    } finally {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
    }
  }

  return (
    <div style={{ minHeight: "100dvh" }}>
      <DashboardSidebar logoSrc={logoSvg} onAddRenter={() => setShowAddModal(true)} />

      <div className="lg:pl-[272px]">
        <DashboardHeader
          logoSrc={logoSvg}
          userEmail={user.email}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => setActiveFeatureScaffold("notifications")}
          onOpenProfile={() => setActiveFeatureScaffold("profile")}
          onOpenSettings={() => setActiveFeatureScaffold("settings")}
          onOpenSupport={() => setActiveFeatureScaffold("support")}
          onSignOut={() => setShowSignOutConfirm(true)}
        />

        <main className="ledger-dashboard-main">
          <div className="ledger-dashboard-shell">
            <PortfolioOverviewSection
              totalMonthlyRevenue={totalMonthlyRevenue}
              totalDue={totalDue}
              collectionRate={collectionRate}
              rentersCount={renters.length}
              overdueCount={overdueRenters.length}
              canReceivePayment={Boolean(selectedRenter)}
              onReceivePayment={() => setShowMarkPaidModal(true)}
            />

            <div className="ledger-dashboard-split">
              <RentersLedgerSection
                isLoading={rentersQuery.isLoading}
                isError={rentersQuery.isError}
                hasData={Boolean(rentersQuery.data)}
                renters={renters}
                filteredRenters={filteredRenters}
                selectedRenterId={selectedRenter?.id ?? null}
                selectedRenter={selectedRenter}
                onSelectRenter={(renter) => setSelectedRenterId((prev) => (prev === renter.id ? null : renter.id))}
                onAddRenter={() => setShowAddModal(true)}
                onClearSearch={() => setSearchQuery("")}
                onCloseSelectedRenter={() => setSelectedRenterId(null)}
                onMarkPaid={() => setShowMarkPaidModal(true)}
              />

              <div className="ledger-dashboard-rail hidden lg:flex">
                <RenterDetailsPanel
                  renter={selectedRenter}
                  onMarkPaid={() => setShowMarkPaidModal(true)}
                  onClose={() => setSelectedRenterId(null)}
                />
              </div>
            </div>

            <section style={{ background: "#f2f4f6", borderRadius: 6, padding: "22px 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <div style={{ maxWidth: 560 }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#45464d" }}>
                    Supporting surface
                  </p>
                  <h3 style={{ margin: "8px 0 0", fontFamily: "Manrope, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#191c1e" }}>
                    Recent Activity
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#45464d" }}>
                    Reserved space for payment events and lease workflow updates without crowding the detail panel.
                  </p>
                </div>
                <span
                  style={{
                    background: "#e6e8ea",
                    borderRadius: 9999,
                    padding: "3px 9px",
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#45464d",
                  }}
                >
                  Scaffolded
                </span>
              </div>
              <div className="ledger-support-grid">
                {["Payment timeline", "Lease workflow"].map((label) => (
                  <div key={label} style={{ background: "#fff", borderRadius: 4, padding: "16px 16px 14px", boxShadow: "0 12px 40px rgba(25,28,30,0.06)" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#191c1e" }}>{label}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#45464d", lineHeight: 1.55 }}>Upcoming integration with backend events.</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="ledger-mobile-fab inline-flex lg:hidden"
        style={{
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderRadius: 9999,
          border: "none",
          background: "linear-gradient(135deg, #0f172a, #131b2e)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "inherit",
          boxShadow: "0 16px 32px rgba(15,23,42,0.22)",
        }}
      >
        <Plus size={15} color="#fff" />
        Add Renter
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 px-2 py-3 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                disabled={!item.active}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 4,
                  padding: "8px 0",
                  border: "none",
                  background: item.active ? "#dff5ed" : "transparent",
                  color: item.active ? "#047857" : "#45464d",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <AddRenterModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (payload) => createMutation.mutateAsync(payload)}
      />

      <FeatureScaffoldDialog
        feature={activeFeatureScaffold ? featureScaffolds[activeFeatureScaffold] : null}
        onClose={() => setActiveFeatureScaffold(null)}
      />

      <SignOutConfirmDialog
        isOpen={showSignOutConfirm}
        isSubmitting={isSigningOut}
        onCancel={() => setShowSignOutConfirm(false)}
        onConfirm={() => {
          void handleSignOut();
        }}
      />

      {selectedRenter ? (
        <MarkPaidModal
          isOpen={showMarkPaidModal}
          onClose={() => setShowMarkPaidModal(false)}
          renterId={selectedRenter.id}
          renterName={selectedRenter.name}
          appartmentNumber={selectedRenter.appartmentNumber}
          defaultAmount={selectedRenter.rentAmount}
          onComplete={() => {
            void queryClient.invalidateQueries({ queryKey: ["renters"] });
            void queryClient.invalidateQueries({ queryKey: ["payments", selectedRenter.id] });
          }}
        />
      ) : null}
    </div>
  );
}
