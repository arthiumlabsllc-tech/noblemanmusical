import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("RESEND_API_KEY is not set — emails will not be sent.");
}

type SendArgs = Parameters<Resend["emails"]["send"]>[0];
type SendResult = Awaited<ReturnType<Resend["emails"]["send"]>>;
// Resend doesn't export ErrorResponse, so recover it from the result union.
type SendError = NonNullable<SendResult["error"]>;

let client: Resend | null = null;

function getClient(): Resend | null {
  // Treat blank (env-var default) the same as absent.
  if (!apiKey) return null;
  client ??= new Resend(apiKey);
  return client;
}

/**
 * Lazy Resend wrapper.
 *
 * Constructing `new Resend("")` throws, and this module is imported by API
 * routes that `next build` evaluates during page-data collection — so an
 * eager client would fail the whole build whenever email is not configured.
 * Holding the client back keeps Resend genuinely optional.
 *
 * Exposed as `resend.emails.send(...)` so call sites need no changes.
 */
export const resend = {
  emails: {
    async send(payload: SendArgs): Promise<SendResult> {
      const active = getClient();
      if (!active) {
        console.warn("Email skipped — RESEND_API_KEY is not configured.");
        const error: SendError = {
          name: "missing_required_field",
          message: "RESEND_API_KEY is not configured — email was not sent",
        };
        return { data: null, error };
      }
      return active.emails.send(payload);
    },
  },
};

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@noblemanmusical.com";
