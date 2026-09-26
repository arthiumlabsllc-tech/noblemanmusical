"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/product/shop-filters";
import { ShopSort } from "@/components/product/shop-sort";
import { Pagination } from "@/components/product/pagination";
import { PackageSearch } from "lucide-react";

interface ShopContentProps {
  perPage: number;
}

export function ShopContent({ perPage }: ShopContentProps) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : Infinity;
  const sort = searchParams.get("sort") || "featured";

  const filtered = useMemo(() => {
    let result = [...products];

    if (category) {
      result = result.filter((p) => p.categorySlug === category);
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
  }, [category, brand, inStock, minPrice, maxPrice, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex gap-8">
      <ShopFilters />

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-charcoal/60">
            Showing <span className="font-medium text-charcoal">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
          </p>
          <ShopSort />
        </div>

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
