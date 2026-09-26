"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatGHS } from "@/lib/utils";

interface SearchHit {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setTotal(0);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&perPage=6`);
      const data = await res.json();
      setResults(data.hits ?? []);
      setTotal(data.total ?? 0);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(`/product/${results[activeIndex].slug}`);
        setIsOpen(false);
        setQuery("");
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/60" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search instruments..."
          className="w-full rounded-lg border border-cream-dark bg-white py-2.5 pl-10 pr-10 text-sm text-charcoal placeholder:text-charcoal/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          aria-label="Search products"
          aria-expanded={isOpen}
          role="combobox"
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-charcoal/60" />
        )}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-cream-dark bg-white shadow-lg"
        >
          {results.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {results.map((hit, i) => (
                  <Link
                    key={hit.slug}
                    id={`search-result-${i}`}
                    href={`/product/${hit.slug}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      i === activeIndex
                        ? "bg-gold/10"
                        : "hover:bg-cream/50"
                    }`}
                  >
                    {hit.image && (
                      <Image
                        src={hit.image}
                        alt={hit.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-charcoal">
                        {hit.name}
                      </p>
                      <p className="text-xs text-charcoal/50">
                        {hit.brand} · {hit.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-navy-deep">
                      {formatGHS(hit.price)}
                    </span>
                  </Link>
                ))}
              </div>
              {total > 6 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="block border-t border-cream-dark bg-cream/30 px-4 py-2.5 text-center text-sm font-medium text-navy-deep hover:bg-cream/50"
                >
                  View all {total} results →
                </Link>
              )}
            </>
          ) : query.trim() && !loading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-charcoal/60">No results found</p>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="mt-2 text-sm font-medium text-gold hover:text-gold-light"
              >
                Search all products →
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
