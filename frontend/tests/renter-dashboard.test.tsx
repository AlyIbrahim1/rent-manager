import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../src/api/client", () => ({
  api: {
    listRenters: vi.fn().mockResolvedValue([
      {
        id: "renter-1",
        appartmentNumber: 101,
        name: "Test Tenant",
        rentAmount: 1000,
        lastMonthPayed: "2026-03",
        unpaidMonths: 0,
        rentDue: 0,
      },
    ]),
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
});
