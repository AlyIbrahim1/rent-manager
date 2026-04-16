import type { Renter } from "../../api/types";

type Props = {
  renter: Renter;
  onSelect: (renter: Renter) => void;
};

export function RenterCard({ renter, onSelect }: Props) {
  return (
    <button type="button" onClick={() => onSelect(renter)}>
      <h3>Apt #{renter.appartmentNumber}</h3>
      <p>{renter.name}</p>
      <p>Rent: ${renter.rentAmount}</p>
      <p>Due: ${renter.rentDue ?? 0}</p>
    </button>
  );
}
