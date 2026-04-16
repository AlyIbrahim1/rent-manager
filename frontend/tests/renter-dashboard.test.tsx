import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

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
