import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}));

vi.mock("@/shared/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
    },
  },
}));

import { api } from "@/shared/api/client";

describe("api client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "supabase-access-token" } },
    });
  });

  it("sends credentialed requests with auth header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

    await api.listRenters();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, requestInit] = fetchMock.mock.calls[0];
    expect(requestInit).toMatchObject({
      credentials: "include",
      headers: expect.objectContaining({
        Authorization: "Bearer supabase-access-token",
      }),
    });
  });

  it("handles 204 responses without trying to parse JSON", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));

    await expect(api.deleteDevSession()).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears expired dev session token and falls back to Supabase session", async () => {
    sessionStorage.setItem("dev_token", "expired-dev-token");
    sessionStorage.setItem(
      "dev_session_meta",
      JSON.stringify({ expiresAt: new Date(Date.now() - 60_000).toISOString() })
    );

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

    await api.listRenters();

    const [, requestInit] = fetchMock.mock.calls[0];
    expect(requestInit).toMatchObject({
      headers: expect.objectContaining({
        Authorization: "Bearer supabase-access-token",
      }),
    });
    expect(sessionStorage.getItem("dev_token")).toBeNull();
    expect(sessionStorage.getItem("dev_session_meta")).toBeNull();
  });
});
