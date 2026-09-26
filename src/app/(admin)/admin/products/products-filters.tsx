"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search } from "lucide-react";

export function AdminProductFilters() {
  return (
    <Suspense>
      <FiltersInner />
    </Suspense>
  );
}

function FiltersInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/60" />
      <input
        type="text"
        defaultValue={search}
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-lg border border-cream-dark bg-white py-2 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal/60 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
