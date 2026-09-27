/**
 * Server-side composition of the storefront navigation.
 *
 * Splits the client-safe taxonomy (`departments.ts`) from the data that must
 * stay on the server: this module reads the product seed, so importing it from
 * a client component would pull the whole catalogue into the shared bundle.
 * The root layout resolves the counts once at module load and hands plain,
 * serialisable props to the navbar.
 */

import { products, type SeedProduct } from "@/lib/data/products";
import { departments, withCounts, type Department } from "@/lib/data/departments";

/** Departments annotated with real product counts. */
export const storefrontDepartments: Department[] = withCounts(
  departments,
  products.map((p) => ({ categorySlug: p.categorySlug, tags: p.tags }))
);

export function findDepartment(slug: string | undefined): Department | undefined {
  if (!slug) return undefined;
  return storefrontDepartments.find((d) => d.slug === slug);
}

export interface MegaMenuFeature {
  eyebrow: string;
  productSlug: string;
  name: string;
  departmentSlug: string;
  image: string;
  price: number;
  compareAtPrice: number;
  /** Discount as a whole-number percentage, e.g. 16. */
  savingsPercent: number;
}

function bestDeal(list: SeedProduct[]): MegaMenuFeature | null {
  let winner: { product: SeedProduct; saved: number } | null = null;

  for (const product of list) {
    if (product.compareAtPrice === null || product.compareAtPrice <= product.price) continue;
    if (!product.images[0]) continue;
    if (product.stock <= 0) continue;
    const saved = product.compareAtPrice - product.price;
    if (!winner || saved > winner.saved) winner = { product, saved };
  }

  if (!winner) return null;
  const { product, saved } = winner;
  return {
    eyebrow: "Featured Deal",
    productSlug: product.slug,
    name: product.name,
    departmentSlug: product.categorySlug,
    image: product.images[0],
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? product.price,
    savingsPercent: Math.round((saved / (product.compareAtPrice ?? 1)) * 100),
  };
}

/**
 * The mega menu's right-hand panel.
 *
 * Deterministic on purpose: "rotate per page load" was considered and rejected
 * because a randomised panel renders different HTML on server and client (a
 * hydration mismatch), and because the same shopper should not see a different
 * offer on every reload.
 *
 * TODO(phase-23-item-6): make this admin-configurable — a `isMegaMenuFeature`
 * flag on the product record, so merchandising can swap the panel without a
 * deploy. Until then it is derived from live data (deepest saving in stock)
 * rather than hardcoded to a product that may go out of stock.
 */
export const megaMenuFeature: MegaMenuFeature | null = bestDeal(products);
