import { WHATSAPP_NUMBER } from "@/lib/config";

/**
 * The one way this app builds a `wa.me` link.
 *
 * Replaces three near-identical helpers that each read the env var and repeated
 * their own fallback literal (`lib/utils.ts` `whatsappUrl()`, and
 * `whatsappOrderLink()` / `whatsappLink()` in `lib/whatsapp/client.ts`).
 * Anything that needs a WhatsApp href calls this, so the number and the URL
 * shape can only ever be defined once.
 */
export function buildWhatsAppUrl(options?: { message?: string }): string {
  const clean = WHATSAPP_NUMBER.replace(/\D/g, "");
  const base = `https://wa.me/${clean}`;
  return options?.message
    ? `${base}?text=${encodeURIComponent(options.message)}`
    : base;
}
