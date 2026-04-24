import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/shared/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

import { AuthGate } from "../src/features/auth/components/AuthGate";

describe("AuthGate", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders login when user is unauthenticated", async () => {
    render(<AuthGate />);
    expect(await screen.findByText("Rent Manager")).toBeInTheDocument();
  });

  it("renders the integrated signup page on /signup", async () => {
    window.history.pushState({}, "", "/signup");

    render(<AuthGate />);

    expect(await screen.findByText("Create Account")).toBeInTheDocument();
  });

  it("renders the forgot password page on /forgot-password", async () => {
    window.history.pushState({}, "", "/forgot-password");

    render(<AuthGate />);

    expect(await screen.findByText("Reset Password")).toBeInTheDocument();
  });
});
