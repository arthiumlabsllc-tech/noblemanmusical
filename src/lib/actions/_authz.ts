import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Roles that may open the admin area (mirrors the admin layout guard). */
export const ADMIN_ROLES = ["super_admin", "admin", "manager", "stock_keeper"];
/** Roles that may manage commerce (inventory, discounts). */
export const MANAGER_ROLES = ["super_admin", "admin", "manager"];
/** Owner-level roles (can register employees / configure the org). */
export const OWNER_ROLES = ["super_admin", "admin"];

/**
 * Server-action guard. Ensures a signed-in user whose role is allowed, else
 * redirects. Returns the session for further use.
 */
export async function requireRoles(roles: string[]) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!roles.includes(session.user.role)) redirect("/unauthorized");
  return session;
}
