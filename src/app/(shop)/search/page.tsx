"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Search as SearchIcon, X, MessageCircle, SlidersHorizontal, ChevronDown } from "lucide-react";

interface SearchHit {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  isFeatured: boolean;
}

const sortOptions = [
  { value: "", label: "Relevance" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const categoryFilters = [
  { name: "Guitars", slug: "guitars" },
  { name: "Keyboards", slug: "keyboards" },
  { name: "Drums & Percussion", slug: "drums-percussion" },
  { name: "PA & Sound", slug: "pa-sound" },
  { name: "Studio", slug: "studio" },
  { name: "Traditional Ghanaian", slug: "traditional-ghanaian" },
  { name: "Accessories", slug: "accessories" },
];

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const doSearch = useCallback(async (q: string, cat: string, s: string) => {
    if (!q.trim() && !cat) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (cat) params.set("category", cat);
      if (s) params.set("sort", s);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.hits ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(query, selectedCategory, sort);
  }, [query, selectedCategory, sort, doSearch]);

  function updateUrl(q: string, cat: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="min-h-screen bg-cream pt-chrome">
      {/* Hero Search */}
      <div className="bg-navy-deep py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <RevealOnScroll>
            <h1 className="mb-6 text-center font-display text-3xl font-bold text-cream md:text-4xl">
              Search Instruments
            </h1>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cream/60" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  updateUrl(e.target.value, selectedCategory);
                }}
                placeholder="Search by name, brand, or category..."
                autoFocus
                className="w-full rounded-xl border border-cream/20 bg-navy py-4 pl-12 pr-12 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    updateUrl("", selectedCategory);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-charcoal/60">
            {loading
              ? "Searching..."
              : query.trim() || selectedCategory
                ? `${total} result${total !== 1 ? "s" : ""} for "${query || selectedCategory}"`
                : "Start your search"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                showFilters || selectedCategory
                  ? "border-gold bg-gold/10 text-navy-deep"
                  : "border-cream-dark text-charcoal/60 hover:border-gold/50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-lg border border-cream-dark bg-white px-3 py-2 pr-8 text-sm text-charcoal focus:border-gold focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/60" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-cream-dark bg-white p-4">
            <button
              onClick={() => {
                setSelectedCategory("");
                updateUrl(query, "");
              }}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                !selectedCategory
                  ? "bg-navy-deep text-cream"
                  : "bg-cream text-charcoal/70 hover:bg-gold/10"
              }`}
            >
              All
            </button>
            {categoryFilters.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  const newCat = selectedCategory === cat.slug ? "" : cat.slug;
                  setSelectedCategory(newCat);
                  updateUrl(query, newCat);
                }}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  selectedCategory === cat.slug
                    ? "bg-navy-deep text-cream"
                    : "bg-cream text-charcoal/70 hover:bg-gold/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {results.map((hit, i) => (
              <ProductCard
                key={hit.slug}
                product={{
                  slug: hit.slug,
                  name: hit.name,
                  brand: hit.brand,
                  price: hit.price,
                  compareAtPrice: null,
                  categoryId: "",
                  categorySlug: hit.categorySlug,
                  categoryName: hit.category,
                  images: hit.image ? [hit.image] : [],
                  stock: hit.stock,
                  isFeatured: hit.isFeatured,
                  description: hit.description,
                  specs: {},
                  tags: [],
                  rating: hit.rating,
                  reviewCount: 0,
                }}
                index={i}
              />
            ))}
          </div>
        ) : (query.trim() || selectedCategory) && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="mb-4 h-12 w-12 text-charcoal/50" />
            <h3 className="font-display text-xl font-bold text-navy-deep">No results found</h3>
            <p className="mt-2 max-w-sm text-sm text-charcoal/60">
              Try a different search term or browse our categories.
            </p>
            <a
              href={buildWhatsAppUrl({ message: `Hi, I'm looking for: ${query}` })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-navy-deep hover:bg-gold-light"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
        ) : !query.trim() && !selectedCategory ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="mb-4 h-12 w-12 text-charcoal/50" />
            <h3 className="font-display text-xl font-bold text-navy-deep">Start your search</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Search by instrument name, brand, or category.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
