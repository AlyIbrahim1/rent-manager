import type {
  CreateRenterInput,
  Payment,
  ReceiptPayload,
  ReceiptResponse,
  RecordPaymentInput,
  Renter,
} from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const mockRenters: Renter[] = [
  {
    id: "mock-101",
    appartmentNumber: 101,
    name: "John Doe",
    rentAmount: 1200,
    lastMonthPayed: "2026-01",
    unpaidMonths: 1,
    rentDue: 1200,
  },
];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  async listRenters(): Promise<Renter[]> {
    try {
      return await request<Renter[]>("/api/renters");
    } catch {
      return mockRenters;
    }
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
};
