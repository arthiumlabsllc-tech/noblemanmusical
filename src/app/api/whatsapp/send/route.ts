import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/whatsapp/client";
import { z } from "zod";
import { limits, rateLimitResponse } from "@/lib/security/rate-limit";

const sendSchema = z.object({
  to: z.string().min(10, "Phone number required"),
  template: z.string().min(1, "Template name required"),
  params: z.array(z.string()),
});

/**
 * POST /api/whatsapp/send
 * Server-triggered WhatsApp messages (e.g. order updates from admin).
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = limits.whatsapp(ip);
    if (!rl.success) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((rl.reset - Date.now()) / 1000).toString(),
          ...rateLimitResponse(rl),
        },
      });
    }
    const body = await request.json();
    const parsed = sendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const result = await sendMessage(parsed.data);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch {
    return NextResponse.json(
      { error: "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}
