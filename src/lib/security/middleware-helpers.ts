import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimitResponse, limits } from "@/lib/security/rate-limit";

/**
 * Helper to apply rate limiting to API route handlers.
 * Returns a Response if rate limited, or null to proceed.
 */
export function checkRateLimit(
  request: NextRequest,
  limiter: (ip: string) => ReturnType<typeof limits.api>
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const result = limiter(ip);

  if (!result.success) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
          ...rateLimitResponse(result),
        },
      }
    );
  }

  // Attach rate limit headers to a passthrough response
  const response = NextResponse.next();
  Object.entries(rateLimitResponse(result)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
