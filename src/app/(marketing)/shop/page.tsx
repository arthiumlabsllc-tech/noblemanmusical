import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { getProducts, type ProductQuery } from "@/lib/data/storefront";

export const metadata: Metadata = {
  title: "Shop All Instruments",
  description:
    "Browse premium musical instruments — guitars, basses, amps, drums, keyboards, live sound, and recording equipment. Free delivery in Accra.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function buildQuery(sp: SearchParams): ProductQuery {
  const sortRaw = first(sp.sort) ?? "featured";
  const sort: ProductQuery["sort"] =
    sortRaw === "newest" ||
    sortRaw === "price-asc" ||
    sortRaw === "price-desc" ||
    sortRaw === "featured"
      ? sortRaw
      : sortRaw === "name-asc"
      ? "name"
      : "featured";

  const q: ProductQuery = {
    categorySlug: first(sp.category),
    brandSlug: first(sp.brand),
    search: first(sp.q),
    sort,
  };

  const price = first(sp.price);
  if (price) {
    const [min, max] = price.split("-");
    if (min) q.priceMin = Number(min);
    if (max) q.priceMax = Number(max);
  }
  return q;
}

function ProductGridFallback() {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-mist" />
          <div className="mt-3 h-3 w-1/3 bg-mist" />
          <div className="mt-2 h-4 w-2/3 bg-mist" />
          <div className="mt-2 h-4 w-1/2 bg-mist" />
        </div>
      ))}
    </div>
  );
}

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const query = buildQuery(sp);
  const items = await getProducts(query);

  return (
    <div className="container-wide py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">All Instruments</h1>
        <p className="mt-3 text-sm text-body">{items.length} products</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-20 bg-mist" />
                <div className="h-32 bg-mist" />
              </div>
            }
          >
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-body">Showing {items.length} products</p>
            <Suspense fallback={null}>
              <SortDropdown />
            </Suspense>
          </div>

          {/* Product grid */}
          <Suspense fallback={<ProductGridFallback />}>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {items.map((product) => (
                <ProductCard key={product.slug} {...product} />
              ))}
            </div>
          </Suspense>

          {/* Empty state */}
          {items.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-navy">No products found</p>
              <p className="mt-2 text-sm text-body">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
