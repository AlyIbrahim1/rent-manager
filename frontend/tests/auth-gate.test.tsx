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
  it("renders login when user is unauthenticated", async () => {
    render(<AuthGate />);
    expect(await screen.findByText("Rent Manager")).toBeInTheDocument();
  });
});
