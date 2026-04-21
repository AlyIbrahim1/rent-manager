import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";

const renters = vi.hoisted(() => [
  {
    id: "renter-1",
    appartmentNumber: 101,
    name: "Test Tenant",
    rentAmount: 1000,
    lastMonthPayed: "2026-03",
    unpaidMonths: 0,
    rentDue: 0,
  },
  {
    id: "renter-2",
    appartmentNumber: 202,
    name: "sarah mohamed",
    rentAmount: 1250,
    lastMonthPayed: "2026-02",
    unpaidMonths: 1,
    rentDue: 1250,
  },
  {
    id: "renter-3",
    appartmentNumber: 303,
    name: "Ahmed Hassan",
    rentAmount: 900,
    lastMonthPayed: "2026-04",
    unpaidMonths: 0,
    rentDue: 0,
  },
]);

vi.mock("../src/api/client", () => ({
  api: {
    listRenters: vi.fn().mockResolvedValue(renters),
  },
}));

import { RenterDashboardPage } from "../src/features/renters/RenterDashboardPage";

describe("RenterDashboardPage", () => {
  it("renders renter card from api data", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RenterDashboardPage />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Apt #101/)).toBeInTheDocument();
  });

  it("filters renters by name and apartment number", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RenterDashboardPage />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Apt #101/)).toBeInTheDocument();

    const searchInput = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(searchInput, { target: { value: "sarah" } });

    expect(screen.getByText(/Apt #202/)).toBeInTheDocument();
    expect(screen.queryByText(/Apt #101/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Apt #303/)).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "303" } });

    expect(screen.getByText(/Apt #303/)).toBeInTheDocument();
    expect(screen.queryByText(/Apt #101/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Apt #202/)).not.toBeInTheDocument();
  });

  it("shows an empty state when no renters match", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RenterDashboardPage />
      </QueryClientProvider>
    );

    await screen.findByText(/Apt #101/);

    const searchInput = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(searchInput, { target: { value: "does not exist" } });

    expect(screen.getByText(/No renters match your search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("clears the selected renter when search hides it", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RenterDashboardPage />
      </QueryClientProvider>
    );

    await screen.findByText(/Apt #101/);

    fireEvent.click(screen.getByRole("button", { name: /test tenant/i }));

    const getReceivePaymentButtons = () => screen.getAllByRole("button", { name: /receive payment/i }) as HTMLButtonElement[];
    expect(getReceivePaymentButtons().some((button) => !button.disabled)).toBe(true);

    const searchInput = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(searchInput, { target: { value: "sarah" } });

    expect(getReceivePaymentButtons().every((button) => button.disabled)).toBe(true);
  });
});
