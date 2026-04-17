import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../../api/client";
import type { CreateRenterInput, Renter } from "../../api/types";
import { AddRenterModal } from "./AddRenterModal";
import { MarkPaidModal } from "./MarkPaidModal";
import { RenterCard } from "./RenterCard";
import { RenterDetailsPanel } from "./RenterDetailsPanel";

export function RenterDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);

  const rentersQuery = useQuery({
    queryKey: ["renters"],
    queryFn: api.listRenters,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRenterInput) => api.createRenter(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renters"] }),
  });

  return (
    <main>
      <h1>Rent Manager Dashboard</h1>
      <AddRenterModal onSubmit={async (payload) => createMutation.mutateAsync(payload)} />

      {rentersQuery.isLoading && <p>Loading renters...</p>}
      {rentersQuery.isError && <p>Unable to load renters.</p>}

      <section>
        {(rentersQuery.data ?? []).map((renter) => (
          <RenterCard key={renter.id} renter={renter} onSelect={setSelectedRenter} />
        ))}
      </section>

      <RenterDetailsPanel renter={selectedRenter} />

      {selectedRenter && (
        <MarkPaidModal
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
    </main>
  );
}
