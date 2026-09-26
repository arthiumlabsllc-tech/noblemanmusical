"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories, getBrands } from "@/lib/data/products";
import { X, SlidersHorizontal } from "lucide-react";

export function ShopFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const brands = useMemo(() => getBrands(), []);

  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeInStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasActiveFilters = activeCategory || activeBrand || activeInStock || minPrice || maxPrice;

  const filterContent = (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-navy-deep">
          Category
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => updateFilter("category", activeCategory === cat.slug ? "" : cat.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  activeCategory === cat.slug
                    ? "bg-gold/10 font-medium text-gold-dark"
                    : "text-charcoal/70 hover:bg-cream-dark hover:text-charcoal"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-charcoal/60">{cat.productCount}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-navy-deep">
          Brand
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-charcoal/70 hover:bg-cream-dark"
            >
              <input
                type="checkbox"
                checked={activeBrand === brand}
                onChange={() => updateFilter("brand", activeBrand === brand ? "" : brand)}
                className="h-4 w-4 rounded border-cream-dark accent-gold"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-navy-deep">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ? (Number(minPrice) / 100).toString() : ""}
            onChange={(e) => updateFilter("minPrice", e.target.value ? (Number(e.target.value) * 100).toString() : "")}
            className="w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
          <span className="text-charcoal/60">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ? (Number(maxPrice) / 100).toString() : ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value ? (Number(e.target.value) * 100).toString() : "")}
            className="w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/70">
          <input
            type="checkbox"
            checked={activeInStock}
            onChange={() => updateFilter("inStock", activeInStock ? "" : "true")}
            className="h-4 w-4 rounded border-cream-dark accent-gold"
          />
          In Stock Only
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-cream-dark px-4 py-2 text-sm text-charcoal/60 transition-colors hover:border-kente-red/30 hover:text-kente-red"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-cream-dark bg-white p-6">
          <div className="mb-6 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gold" />
            <h2 className="font-display text-base font-bold text-navy-deep">Filters</h2>
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-cream-dark bg-white px-4 py-2.5 text-sm font-medium text-charcoal lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy-deep">
            !
          </span>
        )}
      </button>

      {/* Mobile Filter Bottom Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-white p-6 safe-bottom">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-gold" />
                <h2 className="font-display text-lg font-bold text-navy-deep">Filters</h2>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 hover:bg-cream-dark">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
