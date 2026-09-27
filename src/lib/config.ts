/**
 * Runtime configuration — the single place that reads the public contact
 * variables.
 *
 * Before this file existed the business number was resolved in eleven different
 * modules, each carrying its own `?? "233244916034"` fallback, so changing the
 * number meant finding and editing every one of them and hoping none was
 * missed. Everything now derives from `WHATSAPP_NUMBER`.
 *
 * Note this module is safe on both sides of the render boundary: it only reads
 * `NEXT_PUBLIC_*`, which Next inlines at build time.
 */

/** Digits only, as `wa.me` requires. The env value may arrive with spaces or a leading `+`. */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"
).replace(/\D/g, "");

/**
 * Group a Ghanaian number as `+233 244 916 034`.
 *
 * Derived rather than stored so the display can never disagree with the digits
 * used to build links — the exact drift this refactor exists to remove. Any
 * number that isn't a Ghanaian country code plus nine local digits is returned
 * in raw international form instead of being silently mangled.
 */
export function formatPhoneDisplay(digits: string): string {
  const local = /^233(\d{9})$/.exec(digits)?.[1];
  if (!local) return `+${digits}`;
  return `+233 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
}

/** Human-readable business phone, for visible text and JSON-LD `telephone`. */
export const PHONE_DISPLAY = formatPhoneDisplay(WHATSAPP_NUMBER);

/**
 * `tel:` href. Built from the digits rather than by stripping `PHONE_DISPLAY`,
 * because `wa.me` links need the same digits — one source, two renderings.
 */
export const PHONE_TEL_HREF = `tel:+${WHATSAPP_NUMBER}`;

/**
 * Example shown in "your phone number" inputs.
 *
 * Deliberately a separate constant instead of reusing `PHONE_DISPLAY`: this is
 * a format hint for the *customer's* own number, so it must not change just
 * because the business line moves.
 */
export const PHONE_INPUT_EXAMPLE = "+233 244 916 034";
