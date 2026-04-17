export type Renter = {
  id: string;
  appartmentNumber: number;
  name: string;
  rentAmount: number;
  lastMonthPayed: string | null;
  unpaidMonths: number | null;
  rentDue: number | null;
};

export type CreateRenterInput = {
  appartmentNumber: number;
  name: string;
  rentAmount: number;
  lastMonthPayed: string | null;
};

export type Payment = {
  id: string;
  monthPaid: string;
  amountPaid: number;
  dateRecorded: string;
};

export type RecordPaymentInput = {
  monthPaid: string;
  amountPaid: number;
};

export type ReceiptPayload = {
  appartmentNumber: number;
  monthPaid: string;
  amountPaid: number;
  name: string;
};

export type ReceiptResponse = {
  path: string;
  downloadUrl: string;
};
