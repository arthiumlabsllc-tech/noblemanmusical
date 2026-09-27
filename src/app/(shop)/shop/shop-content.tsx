"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { products } from "@/lib/data/products";
import { findSubCategory, type Department } from "@/lib/data/departments";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/product/shop-filters";
import { ShopSort } from "@/components/product/shop-sort";
import { Pagination } from "@/components/product/pagination";
import { PackageSearch, X } from "lucide-react";

interface ShopContentProps {
  perPage: number;
  /**
   * Category from the route segment on /shop/[category]. Wins over ?category=
   * so the grid always matches the page heading — previously the segment was
   * never read at all and every category page listed the full catalogue.
   */
  categorySlug?: string;
  /** Serialised department for the route, used to resolve ?sub= facets. */
  department?: Department;
}

export function ShopContent({ perPage, categorySlug, department }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const category = categorySlug || searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const inStock = searchParams.get("inStock") === "true";
  const deals = searchParams.get("deals") === "true";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : Infinity;
  const sort = searchParams.get("sort") || "featured";

  // ?sub=<facet> only resolves inside a department route; on /shop the link
  // would be meaningless, so the param is ignored rather than guessed at.
  const sub = findSubCategory(department, searchParams.get("sub"));

  function clearParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const filtered = useMemo(() => {
    let result = [...products];

    if (category) {
      result = result.filter((p) => p.categorySlug === category);
    }
    if (sub) {
      const tags = new Set(sub.tags);
      result = result.filter((p) => p.tags.some((t) => tags.has(t)));
    }
    if (deals) {
      // A deal is a real crossed-out price, not a marketing label.
      result = result.filter((p) => p.compareAtPrice !== null && p.compareAtPrice > p.price);
    }
    if (brand) {
      result = result.filter((p) => p.brand === brand);
    }
    if (inStock) {
      result = result.filter((p) => p.stock > 0);
    }
    if (minPrice > 0) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice < Infinity) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        // Already in insertion order (newest first for seed)
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [category, sub, deals, brand, inStock, minPrice, maxPrice, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex gap-8">
      <ShopFilters categorySlug={categorySlug} />

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-charcoal/60">
            Showing <span className="font-medium text-charcoal">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
          </p>
          <ShopSort />
        </div>

        {/* Active facet chips. A filtered grid has to say why it is filtered and
            give one-tap removal, otherwise the mega menu's sub-category links
            read as a broken, half-empty category. */}
        {(sub || deals) && (
          <div className="-mt-2 mb-6 flex flex-wrap items-center gap-2">
            {sub && (
              <button
                onClick={() => clearParam("sub")}
                /* Navy text on the gold tint: gold-dark over bg-gold/15 measures
                   2.27:1, navy-deep measures 15.34:1. The gold still carries the
                   identity through the border. */
                className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-medium text-navy-deep transition-colors hover:bg-gold/25"
              >
                {sub.name}
                <X className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Remove {sub.name} filter</span>
              </button>
            )}
            {deals && (
              <button
                onClick={() => clearParam("deals")}
                /* kente-red text needs an un-tinted background to clear AA here:
                   5.14:1 on cream, but only 4.42:1 on the kente-red/10 wash. */
                className="flex items-center gap-1.5 rounded-full border border-kente-red/40 bg-cream px-3 py-1 text-xs font-medium text-kente-red transition-colors hover:bg-kente-red/5"
              >
                On sale only
                <X className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Remove sale filter</span>
              </button>
            )}
          </div>
        )}

        {/* Grid or Empty */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {paginated.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-cream-dark bg-white py-20 text-center">
            <PackageSearch className="mb-4 h-12 w-12 text-charcoal/50" />
            <h3 className="font-display text-xl font-bold text-navy-deep">No products found</h3>
            <p className="mt-2 max-w-sm text-sm text-charcoal/60">
              Try adjusting your filters or browse all categories to find what you&apos;re looking for.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination totalPages={totalPages} currentPage={page} />
          </div>
        )}
      </div>
    </div>
  );
}
