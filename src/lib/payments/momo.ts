/* ═══════════════════════════════════════════════════════════
   MTN MoMo API Client (Collections)
   ═══════════════════════════════════════════════════════════ */

const MOMO_BASE_URL = "https://proxy.momoapi.mtn.com";

interface MomoConfig {
  apiUser: string;
  apiKey: string;
  subscriptionKey: string;
  targetEnvironment: string;
}

function getConfig(): MomoConfig {
  return {
    apiUser: process.env.MOMO_API_USER ?? "",
    apiKey: process.env.MOMO_API_KEY ?? "",
    subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY ?? "",
    targetEnvironment: process.env.MOMO_TARGET_ENVIRONMENT ?? "sandbox",
  };
}

function getHeaders(): Record<string, string> {
  const config = getConfig();
  return {
    "Ocp-Apim-Subscription-Key": config.subscriptionKey,
    "X-Target-Environment": config.targetEnvironment,
    "X-Reference-Id": crypto.randomUUID(),
    "Content-Type": "application/json",
  };
}

/* ── Request to Pay ── */

interface RequestToPayInput {
  amount: number; // in pesewas
  phone: string; // e.g. "233241234567"
  reference: string;
  externalId: string;
}

export async function requestToPay(
  input: RequestToPayInput
): Promise<{ referenceId: string }> {
  const config = getConfig();

  // Convert pesewas to GHS (MoMo expects major units)
  const amountInGHS = (input.amount / 100).toFixed(2);

  // Normalize phone number — remove + or leading 0
  const phone = input.phone.replace(/^(\+?233|0)/, "");

  const referenceId = crypto.randomUUID();

  const res = await fetch(`${MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      Authorization: `Bearer ${config.apiKey}`,
      "X-Reference-Id": referenceId,
    },
    body: JSON.stringify({
      amount: amountInGHS,
      currency: "GHS",
      externalId: input.externalId,
      payer: { partyIdType: "MSISDN", partyId: phone },
      payerMessage: `Payment to Nobleman Musical Center — Ref: ${input.reference}`,
      payeeNote: "Nobleman Musical Center",
    }),
  });

  if (!res.ok && res.status !== 202) {
    const error = await res.text();
    throw new Error(`MoMo requestToPay failed: ${res.status} — ${error}`);
  }

  return { referenceId };
}

/* ── Check Payment Status ── */

export async function checkPaymentStatus(
  referenceId: string
): Promise<{ status: string; amount: string }> {
  const config = getConfig();

  const res = await fetch(
    `${MOMO_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      method: "GET",
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${config.apiKey}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`MoMo status check failed: ${res.status} — ${error}`);
  }

  const json = await res.json();
  return {
    status: json.status as string,
    amount: json.amount as string,
  };
}

/* ── Generate unique reference ── */

export function generateMomoReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MOMO-${timestamp}-${random}`;
}
