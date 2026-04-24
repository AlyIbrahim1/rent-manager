import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
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

const signOutMock = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }));

vi.mock("@/shared/api/client", () => ({
  api: {
    listRenters: vi.fn().mockResolvedValue(renters),
  },
}));

vi.mock("@/shared/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: signOutMock,
    },
  },
}));

import { RenterDashboardPage } from "@/features/renters/pages/RenterDashboardPage";

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RenterDashboardPage user={{ id: "user-1", email: "manager@ledger.test" }} />
    </QueryClientProvider>
  );
}

describe("RenterDashboardPage", () => {
  beforeEach(() => {
    signOutMock.mockClear();
  });

  it("renders renter card from api data", async () => {
    renderDashboard();

    expect(await screen.findByText(/Apt #101/)).toBeInTheDocument();
  });

  it("filters renters by name and apartment number", async () => {
    renderDashboard();

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
    renderDashboard();

    await screen.findByText(/Apt #101/);

    const searchInput = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(searchInput, { target: { value: "does not exist" } });

    expect(screen.getByText(/No renters match your search/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("clears the selected renter when search hides it", async () => {
    renderDashboard();

    await screen.findByText(/Apt #101/);

    fireEvent.click(screen.getByRole("button", { name: /test tenant/i }));

    const getReceivePaymentButtons = () => screen.getAllByRole("button", { name: /receive payment/i }) as HTMLButtonElement[];
    expect(getReceivePaymentButtons().some((button) => !button.disabled)).toBe(true);

    const searchInput = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(searchInput, { target: { value: "sarah" } });

    expect(getReceivePaymentButtons().every((button) => button.disabled)).toBe(true);
  });

  it("opens sign-out from the profile menu", async () => {
    renderDashboard();

    await screen.findByText(/Apt #101/);

    fireEvent.click(screen.getByRole("button", { name: /open profile menu/i }));

    expect(screen.getByRole("menuitem", { name: /view profile/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /account settings/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /help & support/i })).toBeInTheDocument();
    expect(screen.getByText(/manager@ledger\.test/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(screen.getByRole("heading", { name: /^sign out$/i })).toBeInTheDocument();
    expect(signOutMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /^sign out$/i })).not.toBeInTheDocument();
    });
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it("opens scaffolded profile actions from the menu", async () => {
    renderDashboard();

    await screen.findByText(/Apt #101/);

    fireEvent.click(screen.getByRole("button", { name: /open profile menu/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /view profile/i }));

    expect(screen.getByRole("heading", { name: /view profile/i })).toBeInTheDocument();
    expect(screen.getByText(/manager details and workspace membership/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /view profile/i })).not.toBeInTheDocument();
    });
  });

  it("opens a sign-out confirmation screen before logging out", async () => {
    renderDashboard();

    await screen.findByText(/Apt #101/);

    fireEvent.click(screen.getByRole("button", { name: /open profile menu/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(screen.getByRole("heading", { name: /^sign out$/i })).toBeInTheDocument();
    expect(signOutMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /^sign out$/i })).not.toBeInTheDocument();
    });
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it("signs out only after user confirms", async () => {
    renderDashboard();

    await screen.findByText(/Apt #101/);

    fireEvent.click(screen.getByRole("button", { name: /open profile menu/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
    fireEvent.click(screen.getByRole("button", { name: /^sign out$/i }));

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
  });
});
