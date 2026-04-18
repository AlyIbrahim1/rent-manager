import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, LogOut, Loader2, AlertCircle } from "lucide-react";

import { api } from "../../api/client";
import { supabase } from "../../lib/supabase";
import type { CreateRenterInput, Renter } from "../../api/types";
import { AddRenterModal } from "./AddRenterModal";
import { MarkPaidModal } from "./MarkPaidModal";
import { RenterCard } from "./RenterCard";
import { RenterDetailsPanel } from "./RenterDetailsPanel";

export function RenterDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);
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
  }, [seedEnabled]);

  useEffect(() => {
    if (seedEnabled && rentersQuery.data?.length === 0 && !seedMutation.isPending && !seedMutation.isSuccess) {
      seedMutation.mutate();
    }
  }, [rentersQuery.data]);

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
    <div className="min-h-dvh bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <span className="font-display text-xl text-slate-900">Rent Manager</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors duration-200 cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Renter</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`grid gap-8 ${selectedRenter ? "lg:grid-cols-[1fr_360px]" : ""}`}>
          {/* Left: renter grid */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h1 className="font-display text-2xl text-slate-900">Your Renters</h1>
              {rentersQuery.data && (
                <span className="inline-flex items-center bg-slate-100 text-slate-600 font-semibold text-xs rounded-full px-2.5 py-1">
                  {rentersQuery.data.length}
                </span>
              )}
            </div>

            {rentersQuery.isLoading && (
              <div className="flex items-center gap-3 text-slate-400 py-12 justify-center">
                <Loader2 size={20} className="animate-spin" />
                <span>Loading renters…</span>
              </div>
            )}

            {rentersQuery.isError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-red-700 text-sm">Unable to load renters. Check your connection and try again.</p>
              </div>
            )}

            {rentersQuery.data && rentersQuery.data.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 py-16 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium mb-1">No renters yet</p>
                <p className="text-slate-400 text-sm mb-5">Add your first renter to get started.</p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors duration-200 cursor-pointer"
                >
                  <Plus size={16} />
                  Add Renter
                </button>
              </div>
            )}

            {rentersQuery.data && rentersQuery.data.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {rentersQuery.data.map((renter) => (
                  <RenterCard
                    key={renter.id}
                    renter={renter}
                    isSelected={selectedRenter?.id === renter.id}
                    onSelect={(r) => setSelectedRenter(selectedRenter?.id === r.id ? null : r)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: details panel */}
          {selectedRenter && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <RenterDetailsPanel
                renter={selectedRenter}
                onMarkPaid={() => setShowMarkPaidModal(true)}
                onClose={() => setSelectedRenter(null)}
              />
            </div>
          )}
        </div>
      </main>

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
