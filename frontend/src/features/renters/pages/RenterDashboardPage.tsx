import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users2,
  HandCoins,
  BarChart3,
} from "lucide-react";

import { api } from "@/shared/api/client";
import { supabase } from "@/shared/lib/supabase";
import type { CreateRenterInput, Renter } from "@/shared/api/types";
import { SignOutConfirmDialog } from "@/shared/ui/SignOutConfirmDialog";
import { AddRenterModal } from "@/features/renters/components/AddRenterModal";
import { MarkPaidModal } from "@/features/renters/components/MarkPaidModal";
import { RenterDetailsPanel } from "@/features/renters/components/RenterDetailsPanel";
import { DashboardSidebar } from "@/features/renters/components/DashboardSidebar";
import { DashboardHeader } from "@/features/renters/components/DashboardHeader";
import { PortfolioOverviewSection } from "@/features/renters/components/PortfolioOverviewSection";
import { RentersLedgerSection } from "@/features/renters/components/RentersLedgerSection";
import logoSvg from "@/shared/assets/logo.svg";

function matchesSearch(renter: Renter, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  return (
    renter.name.toLowerCase().includes(normalizedQuery) ||
    renter.appartmentNumber.toString().includes(normalizedQuery)
  );
}

export function RenterDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedRenterId, setSelectedRenterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const rentersQuery = useQuery({
    queryKey: ["renters"],
    queryFn: api.listRenters,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRenterInput) => api.createRenter(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renters"] }),
  });

  const seedMutation = useMutation({
    mutationFn: () => api.seedSampleData(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renters"] }),
  });

  const seedEnabled = import.meta.env.VITE_SEED_ENABLED === "true";
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  useEffect(() => {
    if (!seedEnabled) return;
    const handleUnload = () => {
      const token = sessionStorage.getItem("dev_token");
      if (!token) return;
      navigator.sendBeacon(
        `${apiBase}/api/dev-session/cleanup`,
        new Blob([JSON.stringify({ token })], { type: "application/json" }),
      );
      sessionStorage.removeItem("dev_session_meta");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [seedEnabled, apiBase]);

  useEffect(() => {
    if (seedEnabled && rentersQuery.data?.length === 0 && !seedMutation.isPending && !seedMutation.isSuccess) {
      seedMutation.mutate();
    }
  }, [seedEnabled, rentersQuery.data, seedMutation]);

  const renters = rentersQuery.data ?? [];
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredRenters = useMemo(
    () => renters.filter((renter) => matchesSearch(renter, normalizedSearchQuery)),
    [renters, normalizedSearchQuery]
  );
  const selectedRenter = renters.find((renter) => renter.id === selectedRenterId) ?? null;
  const overdueRenters = renters.filter((renter) => (renter.rentDue ?? 0) > 0);
  const onTimeCount = Math.max(renters.length - overdueRenters.length, 0);
  const collectionRate = renters.length > 0 ? Math.round((onTimeCount / renters.length) * 100) : 100;
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

  function openSignOutConfirm() {
    if (isSigningOut) {
      return;
    }
    setShowSignOutConfirm(true);
  }

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <DashboardSidebar
        logoSrc={logoSvg}
        onAddRenter={() => setShowAddModal(true)}
        onSignOut={openSignOutConfirm}
      />

      <div className="lg:pl-72">
        <DashboardHeader
          logoSrc={logoSvg}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddRenter={() => setShowAddModal(true)}
          onSignOut={openSignOutConfirm}
        />

        <main className="space-y-6 px-4 pb-28 pt-4 sm:space-y-8 sm:px-6 sm:pt-8 lg:px-10 lg:pb-10">
          <PortfolioOverviewSection
            totalMonthlyRevenue={totalMonthlyRevenue}
            totalDue={totalDue}
            collectionRate={collectionRate}
            rentersCount={renters.length}
            overdueCount={overdueRenters.length}
            canReceivePayment={Boolean(selectedRenter)}
            onReceivePayment={() => setShowMarkPaidModal(true)}
          />

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <RentersLedgerSection
              isLoading={rentersQuery.isLoading}
              isError={rentersQuery.isError}
              hasData={Boolean(rentersQuery.data)}
              renters={renters}
              filteredRenters={filteredRenters}
              selectedRenterId={selectedRenter?.id ?? null}
              onSelectRenter={(selected: Renter) => {
                setSelectedRenterId((prev) => (prev === selected.id ? null : selected.id));
              }}
              onAddRenter={() => setShowAddModal(true)}
              onClearSearch={() => setSearchQuery("")}
            />

            <div className="hidden space-y-5 xl:block">
              <RenterDetailsPanel
                renter={selectedRenter}
                onMarkPaid={() => setShowMarkPaidModal(true)}
                onClose={() => setSelectedRenterId(null)}
              />

              <section className="rounded-md bg-surface-container-low p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="font-heading text-xl font-bold text-on-surface">Recent Activity</h3>
                  <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                    Scaffolded
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-sm bg-surface-container-lowest p-4">
                    <p className="text-sm font-semibold text-on-surface">Payment timeline</p>
                    <p className="mt-1 text-sm text-on-surface-muted">Upcoming integration with backend payment events.</p>
                  </div>
                  <div className="rounded-sm bg-surface-container-lowest p-4">
                    <p className="text-sm font-semibold text-on-surface">Lease workflow</p>
                    <p className="mt-1 text-sm text-on-surface-muted">Signature and renewal milestones will appear here.</p>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section className="rounded-md bg-surface-container-low p-4 xl:hidden">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading text-lg font-bold text-on-surface">Recent Activity</h3>
              <span className="rounded-full bg-surface-container-high px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
                Soon
              </span>
            </div>
            <p className="mt-2 text-sm text-on-surface-muted">Payment timeline and lease milestones will appear in this panel.</p>
          </section>
        </main>
      </div>

      {selectedRenter && (
        <div
          className="fixed inset-0 z-30 bg-[#0b1220]/55 backdrop-blur-sm xl:hidden"
          onClick={() => setSelectedRenterId(null)}
          aria-hidden="true"
        >
          <div
            className="absolute inset-x-0 bottom-16 max-h-[72dvh] overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-3 pb-4 shadow-floating"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-outline-variant/40" />
            <RenterDetailsPanel
              renter={selectedRenter}
              onMarkPaid={() => setShowMarkPaidModal(true)}
              onClose={() => setSelectedRenterId(null)}
              variant="sheet"
            />
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/20 bg-surface-container-lowest/95 px-2 py-3 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          <button type="button" className="flex flex-col items-center gap-1 rounded-sm bg-[#dff5ed] py-2 text-[#047857]">
            <LayoutDashboard size={16} />
            <span className="text-[10px] font-semibold">Portfolio</span>
          </button>
          <button type="button" disabled className="flex flex-col items-center gap-1 rounded-sm py-2 text-on-surface-muted">
            <Users2 size={16} />
            <span className="text-[10px] font-semibold">Ledger</span>
          </button>
          <button type="button" disabled className="flex flex-col items-center gap-1 rounded-sm py-2 text-on-surface-muted">
            <HandCoins size={16} />
            <span className="text-[10px] font-semibold">Payments</span>
          </button>
          <button type="button" disabled className="flex flex-col items-center gap-1 rounded-sm py-2 text-on-surface-muted">
            <BarChart3 size={16} />
            <span className="text-[10px] font-semibold">Insight</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AddRenterModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (payload) => createMutation.mutateAsync(payload)}
      />

      <SignOutConfirmDialog
        isOpen={showSignOutConfirm}
        isSubmitting={isSigningOut}
        onCancel={() => setShowSignOutConfirm(false)}
        onConfirm={() => {
          void handleSignOut();
        }}
      />

      {selectedRenter && (
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
      )}
    </div>
  );
}
