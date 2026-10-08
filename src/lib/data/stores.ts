/**
 * Store (multi-brand / multi-town) data-access layer.
 *
 * Mirrors the storefront layer: query the real schema via the lazy `db` client
 * and fall back to seed-equivalent mock data when there is no DATABASE_URL, so
 * the admin dashboard, POS and store switcher keep rendering during development.
 *
 * The "active store" is a server-side selection persisted in a cookie — it lets
 * an admin scope inventory/POS to one town without re-authenticating.
 */
import { cookies } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { stores } from "@/lib/db/schema";

export type Store = {
  id: string;
  slug: string;
  name: string;
  brandName: string | null;
  town: string | null;
  region: string | null;
  isPrimary: boolean;
  isActive: boolean;
};

export const ACTIVE_STORE_COOKIE = "nobleman_active_store";

// ── Fallback (mock) stores ────────────────────────────────────────────────────
const FALLBACK_STORES: Store[] = [
  {
    id: "sto_accra_main",
    slug: "accra-main",
    name: "Nobleman Musical Center — Accra",
    brandName: "Nobleman Musical Center",
    town: "Accra",
    region: "Greater Accra",
    isPrimary: true,
    isActive: true,
  },
  {
    id: "sto_kumasi",
    slug: "kumasi",
    name: "Nobleman Musical Center — Kumasi",
    brandName: "Nobleman Musical Center",
    town: "Kumasi",
    region: "Ashanti",
    isPrimary: false,
    isActive: true,
  },
];

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getStores(onlyActive = true): Promise<Store[]> {
  if (!isDatabaseConfigured()) return onlyActive ? FALLBACK_STORES : FALLBACK_STORES;
  try {
    const rows = await db
      .select({
        id: stores.id,
        slug: stores.slug,
        name: stores.name,
        brandName: stores.brandName,
        town: stores.town,
        region: stores.region,
        isPrimary: stores.isPrimary,
        isActive: stores.isActive,
      })
      .from(stores)
      .where(onlyActive ? eq(stores.isActive, true) : undefined)
      .orderBy(asc(stores.isPrimary), asc(stores.name));
    return rows.length > 0 ? rows : FALLBACK_STORES;
  } catch (err) {
    console.error("[stores] getStores failed, using fallback:", err);
    return FALLBACK_STORES;
  }
}

export async function getPrimaryStore(): Promise<Store> {
  const all = await getStores();
  return all.find((s) => s.isPrimary) ?? all[0];
}

/**
 * The store an admin/POS is currently working in. Reads the selection cookie and
 * validates it against the known stores; falls back to the primary store.
 */
export async function getActiveStore(): Promise<Store> {
  const all = await getStores();
  let selected: string | undefined;
  try {
    selected = (await cookies()).get(ACTIVE_STORE_COOKIE)?.value;
  } catch {
    selected = undefined;
  }
  if (selected) {
    const match = all.find((s) => s.id === selected || s.slug === selected);
    if (match) return match;
  }
  return all.find((s) => s.isPrimary) ?? all[0];
}

export async function getActiveStoreId(): Promise<string> {
  return (await getActiveStore()).id;
}
