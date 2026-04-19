import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  LogOut,
  Loader2,
  AlertCircle,
  Search,
  Bell,
  LayoutDashboard,
  Building2,
  Users2,
  HandCoins,
  BarChart3,
  Settings,
  ArrowUpRight,
  Wallet,
  ChevronRight,
} from "lucide-react";

import { api } from "../../api/client";
import { supabase } from "../../lib/supabase";
import type { CreateRenterInput, Renter } from "../../api/types";
import { AddRenterModal } from "./AddRenterModal";
import { MarkPaidModal } from "./MarkPaidModal";
import { RenterCard } from "./RenterCard";
import { RenterDetailsPanel } from "./RenterDetailsPanel";
import logoSvg from "../../assets/logo.svg";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Properties", icon: Building2, active: false },
  { label: "Tenants", icon: Users2, active: false },
  { label: "Payments", icon: HandCoins, active: false },
  { label: "Reports", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
] as const;

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString()}`;
}

export function RenterDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedRenterId, setSelectedRenterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

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
  const selectedRenter = renters.find((renter) => renter.id === selectedRenterId) ?? null;
  const overdueRenters = renters.filter((renter) => (renter.rentDue ?? 0) > 0);
  const onTimeCount = Math.max(renters.length - overdueRenters.length, 0);
  const collectionRate = renters.length > 0 ? Math.round((onTimeCount / renters.length) * 100) : 100;
  const totalMonthlyRevenue = renters.reduce((sum, renter) => sum + renter.rentAmount, 0);
  const totalDue = renters.reduce((sum, renter) => sum + Math.max(renter.rentDue ?? 0, 0), 0);

  async function handleSignOut() {
    if (sessionStorage.getItem("dev_token")) {
      await api.deleteDevSession().catch(() => {});
      sessionStorage.removeItem("dev_token");
      sessionStorage.removeItem("dev_session_meta");
      window.location.reload();
      return;
    }
    void supabase.auth.signOut();
  }

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:flex-col lg:bg-surface-container-low lg:px-4 lg:py-8">
        <div className="px-4">
          <img src={logoSvg} alt="The Ledger" className="h-10 w-auto" />
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-on-surface-muted">Architectural Management</p>
        </div>

        <nav className="mt-8 flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                disabled={!item.active}
                className={`group relative flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left transition-all duration-200 ${
                  item.active
                    ? "bg-surface-container-high text-[#059669] shadow-layer"
                    : "text-on-surface-muted hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {item.active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#059669]" aria-hidden="true" />}
                <Icon size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">{item.label}</span>
                {!item.active && <span className="ml-auto text-[10px] uppercase tracking-[0.18em] opacity-70">Soon</span>}
              </button>
            );
          })}
        </nav>

        <div className="space-y-3 px-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add Renter
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-surface-container-high px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 bg-surface-container-lowest/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-3 rounded-md bg-surface-container-low px-3 py-3 sm:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img src={logoSvg} alt="The Ledger" className="h-7 w-auto lg:hidden" />
              <label className="hidden min-w-0 flex-1 items-center gap-2 rounded-sm bg-surface-container-highest px-3 py-2 text-sm text-on-surface-muted md:flex">
                <Search size={16} />
                <input
                  type="text"
                  value=""
                  readOnly
                  aria-label="Search"
                  placeholder="Search properties, tenants..."
                  className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none"
                />
              </label>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-surface-container-high text-on-surface-muted transition-colors hover:bg-surface-container"
                aria-label="Notifications"
              >
                <Bell size={17} />
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="hidden items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container sm:inline-flex lg:hidden"
              >
                <Plus size={14} />
                Add Renter
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-surface-container-high text-on-surface transition-colors hover:bg-surface-container lg:hidden"
                aria-label="Sign out"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-6 px-4 pb-28 pt-4 sm:space-y-8 sm:px-6 sm:pt-8 lg:px-10 lg:pb-10">
          <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-heading text-[2.25rem] font-bold leading-tight text-on-surface sm:text-[2.5rem]">Portfolio Overview</h1>
              <p className="mt-2 text-sm text-on-surface-muted">Status summary and current renter ledger across active units.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-sm bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
              >
                Export Report
              </button>
              <button
                type="button"
                onClick={() => setShowMarkPaidModal(true)}
                disabled={!selectedRenter}
                className="inline-flex items-center gap-2 rounded-sm bg-tertiary-container px-4 py-2 text-sm font-semibold text-tertiary-fixed transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Wallet size={15} />
                Receive Payment
              </button>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            <article className="animate-reveal-up col-span-2 rounded-md bg-surface-container-lowest p-5 shadow-layer md:col-span-1 md:p-6" style={{ animationDelay: "30ms" }}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">Total Revenue</span>
                <ArrowUpRight size={16} className="text-on-surface-muted" />
              </div>
              <p className="font-heading text-[2.9rem] font-bold leading-none text-on-surface sm:text-[3.3rem]">{formatCurrency(totalMonthlyRevenue)}</p>
              <p className="mt-3 text-sm text-[#059669]">{collectionRate}% collection rate this cycle</p>
            </article>

            <article className="animate-reveal-up rounded-md bg-surface-container-lowest p-5 shadow-layer md:p-6" style={{ animationDelay: "80ms" }}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">Occupancy Rate</span>
                <Building2 size={16} className="text-on-surface-muted" />
              </div>
              <div className="flex items-end gap-2">
                <p className="font-heading text-[2.7rem] font-bold leading-none text-on-surface sm:text-[3.3rem]">{renters.length > 0 ? "100%" : "0%"}</p>
                <p className="pb-2 text-sm text-on-surface-muted">{renters.length} units tracked</p>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-container">
                <div className="h-full rounded-full bg-primary" style={{ width: renters.length > 0 ? "100%" : "0%" }} />
              </div>
            </article>

            <article className="animate-reveal-up rounded-md bg-surface-container-lowest p-5 shadow-layer md:p-6" style={{ animationDelay: "130ms" }}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">Pending Balance</span>
                <AlertCircle size={16} className="text-on-surface-muted" />
              </div>
              <p className="font-heading text-[2.7rem] font-bold leading-none text-on-surface sm:text-[3.3rem]">{formatCurrency(totalDue)}</p>
              <p className="mt-3 text-sm text-[#F43F5E]">{overdueRenters.length} overdue {overdueRenters.length === 1 ? "renter" : "renters"}</p>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <div className="space-y-5 rounded-md bg-surface-container-low p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-[1.35rem] font-bold text-on-surface sm:text-2xl">Renters Ledger</h2>
                  <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
                    {renters.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-surface-container-high px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
                >
                  Add
                  <ChevronRight size={14} />
                </button>
              </div>

              {rentersQuery.isLoading && (
                <div className="flex items-center justify-center gap-3 rounded-md bg-surface-container-lowest py-14 text-on-surface-muted">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Loading renters...</span>
                </div>
              )}

              {rentersQuery.isError && (
                <div className="flex items-start gap-3 rounded-md bg-[#ffe9ec] px-5 py-4 text-[#9f1239]">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm">Unable to load renters. Check your connection and try again.</p>
                </div>
              )}

              {rentersQuery.data && renters.length === 0 && (
                <div className="rounded-md bg-surface-container-lowest px-6 py-16 text-center">
                  <p className="font-heading text-3xl font-semibold text-on-surface">No renters yet</p>
                  <p className="mt-2 text-sm text-on-surface-muted">Start your ledger with the first active unit.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
                  >
                    <Plus size={15} />
                    Add Renter
                  </button>
                </div>
              )}

              {rentersQuery.data && renters.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renters.map((renter) => (
                    <RenterCard
                      key={renter.id}
                      renter={renter}
                      isSelected={selectedRenter?.id === renter.id}
                      onSelect={(selected: Renter) => setSelectedRenterId((prev) => (prev === selected.id ? null : selected.id))}
                    />
                  ))}
                </div>
              )}
            </div>

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
