/* ═══════════════════════════════════════════════════════════
   WhatsApp Business Cloud API Client
   ═══════════════════════════════════════════════════════════ */

import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

interface SendMessageInput {
  to: string; // Phone number in international format (e.g. "233241234567")
  template: string; // Template name
  params: string[]; // Template parameters
}

function getConfig() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  };
}

/**
 * Send a templated WhatsApp message via the Cloud API.
 * Requires pre-approved message templates in the WhatsApp Business Manager.
 */
export async function sendMessage(input: SendMessageInput): Promise<{ messageId?: string; error?: string }> {
  const config = getConfig();

  if (!config.phoneNumberId || !config.accessToken) {
    console.warn("WhatsApp API credentials not configured — skipping message.");
    return { error: "WhatsApp not configured" };
  }

  try {
    const res = await fetch(
      `${WHATSAPP_API_URL}/${config.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: input.to,
          type: "template",
          template: {
            name: input.template,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: input.params.map((text) => ({
                  type: "text",
                  text,
                })),
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("WhatsApp API error:", error);
      return { error: error?.error?.message ?? "Failed to send message" };
    }

    const data = await res.json();
    return { messageId: data.messages?.[0]?.id };
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return { error: "Network error sending WhatsApp message" };
  }
}

/**
 * Generate a wa.me deep link for client-side WhatsApp ordering.
 */
export function whatsappOrderLink(params: {
  productName: string;
  productUrl: string;
  price: string;
}): string {
  return buildWhatsAppUrl({
    message: `Hi Nobleman, I'd like to order: ${params.productName} (${params.productUrl}) — ${params.price}`,
  });
}

/**
 * Generate a generic wa.me link with a custom message.
 */
export function whatsappLink(message: string): string {
  return buildWhatsAppUrl({ message });
}
