"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ACTIVE_STORE_COOKIE, getStores } from "@/lib/data/stores";

/**
 * Persist the admin/POS active-store selection in a cookie (no re-login) and
 * refresh the screens that read it. The value is validated against the known
 * store slugs before being accepted.
 */
export async function setActiveStoreAction(formData: FormData) {
  const slug = String(formData.get("store") ?? "");
  const valid = (await getStores()).map((s) => s.slug);
  if (!slug || !valid.includes(slug)) return;

  const jar = await cookies();
  jar.set(ACTIVE_STORE_COOKIE, slug, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/pos");
}
