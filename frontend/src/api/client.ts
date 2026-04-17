import type {
  CreateRenterInput,
  Payment,
  ReceiptPayload,
  ReceiptResponse,
  RecordPaymentInput,
  Renter,
} from "./types";
import { supabase } from "../lib/supabase";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";


async function getAuthHeader(): Promise<Record<string, string>> {
  const devToken = sessionStorage.getItem("dev_token");
  if (devToken) return { Authorization: `Bearer ${devToken}` };
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (typeof errorBody.detail === "string" && errorBody.detail.trim()) {
        detail = errorBody.detail;
      }
    } catch {
      // Keep generic message when no JSON body is available.
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  listRenters(): Promise<Renter[]> {
    return request<Renter[]>("/api/renters");
  },

  createRenter(input: CreateRenterInput): Promise<Renter> {
    return request<Renter>("/api/renters", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  recordPayment(renterId: string, input: RecordPaymentInput): Promise<Payment> {
    return request<Payment>(`/api/renters/${renterId}/payments`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  listPayments(renterId: string): Promise<Payment[]> {
    return request<Payment[]>(`/api/renters/${renterId}/payments`);
  },

  generateReceipt(payload: ReceiptPayload): Promise<ReceiptResponse> {
    return request<ReceiptResponse>("/api/receipts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  seedSampleData(): Promise<{ seeded: boolean; renters_created?: number; reason?: string }> {
    return request("/api/seed", { method: "POST" });
  },

  deleteDevSession(): Promise<void> {
    return request("/api/dev-session", { method: "DELETE" });
  },
};
