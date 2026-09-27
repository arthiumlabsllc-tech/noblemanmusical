import { auth } from "@/lib/auth";

/**
 * Authorization guards for admin-only mutations.
 *
 * WHY THIS EXISTS
 * ---------------
 * `src/middleware.ts` gates the `/admin/*` *page* routes, which makes the
 * admin panel look protected. But middleware cannot be the authorization
 * boundary here for two reasons:
 *
 * 1. Its matcher (middleware.ts L40) passes every `/api/` path straight
 *    through with `NextResponse.next()`, so API route handlers run with no
 *    session check at all.
 * 2. Server actions are reachable by POSTing directly to the action's
 *    endpoint — the UI never has to be involved.
 *
 * So every privileged mutation must assert the caller's role itself.
 */

const STAFF_ROLES: readonly string[] = ["admin", "staff"];

/** Thrown by `requireAdmin` when the caller is not authenticated staff. */
export class UnauthorizedError extends Error {
  constructor(message = "Admin access required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Returns the current session only if the user is admin or staff.
 * Use in route handlers, where you want to build the 401/403 response yourself.
 */
export async function getAdminSession() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user || typeof role !== "string" || !STAFF_ROLES.includes(role)) {
    return null;
  }

  return session;
}

/**
 * Server-action guard. Throws `UnauthorizedError` unless the caller is
 * admin or staff.
 *
 * Throw rather than return: in a `"use server"` file a rejected promise
 * surfaces to the caller instead of silently continuing past the check.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

/** True when `error` came from one of these guards (i.e. a 401, not a 500). */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof UnauthorizedError;
}
