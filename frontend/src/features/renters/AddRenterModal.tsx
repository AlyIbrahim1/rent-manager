import { useState } from "react";

import type { CreateRenterInput } from "../../api/types";

type Props = {
  onSubmit: (payload: CreateRenterInput) => Promise<unknown>;
};

export function AddRenterModal({ onSubmit }: Props) {
  const [name, setName] = useState("John Doe");
  const [appartmentNumber, setAppartmentNumber] = useState(101);
  const [rentAmount, setRentAmount] = useState(1200);
  const [lastMonthPayed, setLastMonthPayed] = useState("2026-01");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({
          name,
          appartmentNumber,
          rentAmount,
          lastMonthPayed,
        });
      }}
    >
      <button type="submit">Add renter</button>
      <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Renter name" />
      <input
        value={appartmentNumber}
        type="number"
        onChange={(event) => setAppartmentNumber(Number(event.target.value))}
        aria-label="Apartment number"
      />
      <input
        value={rentAmount}
        type="number"
        onChange={(event) => setRentAmount(Number(event.target.value))}
        aria-label="Rent amount"
      />
      <input
        value={lastMonthPayed}
        onChange={(event) => setLastMonthPayed(event.target.value)}
        aria-label="Last month paid"
      />
    </form>
  );
}
