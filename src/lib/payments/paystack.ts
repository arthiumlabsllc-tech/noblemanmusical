import { z } from "zod";

/* ═══════════════════════════════════════════════════════════
   Paystack API Client
   ═══════════════════════════════════════════════════════════ */

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getHeaders() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  };
}

/* ── Initialize Transaction ── */

interface InitializeInput {
  email: string;
  amount: number; // in pesewas (kobo-like)
  reference: string;
  callback_url: string;
  metadata?: Record<string, unknown>;
}

const initializeResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    authorization_url: z.string(),
    access_code: z.string(),
    reference: z.string(),
  }),
});

export async function initializeTransaction(
  input: InitializeInput
): Promise<z.infer<typeof initializeResponseSchema>> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: input.email,
      amount: input.amount, // Paystack expects amount in smallest currency unit
      reference: input.reference,
      callback_url: input.callback_url,
      metadata: input.metadata,
      currency: "GHS",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Paystack initialize failed: ${res.status} — ${error}`);
  }

  const json = await res.json();
  return initializeResponseSchema.parse(json);
}

/* ── Verify Transaction ── */

interface VerifyResult {
  status: string;
  amount: number;
  customer: { email: string };
  gateway_response: string;
  reference: string;
}

export async function verifyTransaction(
  reference: string
): Promise<VerifyResult> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Paystack verify failed: ${res.status} — ${error}`);
  }

  const json = await res.json();

  return {
    status: json.data.status as string,
    amount: json.data.amount as number,
    customer: { email: json.data.customer?.email ?? "" },
    gateway_response: json.data.gateway_response as string,
    reference: json.data.reference as string,
  };
}

/* ── Generate unique reference ── */

export function generatePaystackReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NMC-${timestamp}-${random}`;
}
