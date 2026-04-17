import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../src/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

import { AuthGate } from "../src/features/auth/AuthGate";

describe("AuthGate", () => {
  it("renders login when user is unauthenticated", async () => {
    render(<AuthGate />);
    expect(await screen.findByText("Sign in to Rent Manager")).toBeInTheDocument();
  });
});
