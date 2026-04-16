import { render, screen } from "@testing-library/react";

import { AuthGate } from "../src/features/auth/AuthGate";

describe("AuthGate", () => {
  it("renders login when user is unauthenticated", () => {
    render(<AuthGate />);
    expect(screen.getByText("Sign in to Rent Manager")).toBeInTheDocument();
  });
});
