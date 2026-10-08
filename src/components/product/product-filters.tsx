"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface FilterSectionProps {
  title: string;
  options: Array<{ value: string; label: string; count?: number }>;
  paramName: string;
}

function FilterSection({ title, options, paramName }: FilterSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = searchParams.get(paramName);

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (current === value) {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="border-b border-charcoal/10 pb-4">
      <h3 className="mb-3 text-sm font-semibold text-navy">{title}</h3>
      <ul className="space-y-2">
        {options.map((opt) => (
          <li key={opt.value}>
            <button
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "flex w-full items-center justify-between rounded px-2 py-1 text-left text-sm transition-colors hover:bg-cream",
                current === opt.value ? "font-semibold text-gold" : "text-charcoal"
              )}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span className="text-xs text-charcoal/40">{opt.count}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface PriceFilterProps {
  paramName?: string;
}

function PriceFilter({ paramName = "price" }: PriceFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = searchParams.get(paramName);

  const ranges = [
    { value: "0-500", label: "Under GH₵ 500" },
    { value: "500-1000", label: "GH₵ 500 – 1,000" },
    { value: "1000-3000", label: "GH₵ 1,000 – 3,000" },
    { value: "3000-5000", label: "GH₵ 3,000 – 5,000" },
    { value: "5000-99999", label: "GH₵ 5,000+" },
  ];

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (current === value) {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="border-b border-charcoal/10 pb-4">
      <h3 className="mb-3 text-sm font-semibold text-navy">Price</h3>
      <ul className="space-y-2">
        {ranges.map((r) => (
          <li key={r.value}>
            <button
              type="button"
              onClick={() => toggle(r.value)}
              className={cn(
                "w-full rounded px-2 py-1 text-left text-sm transition-colors hover:bg-cream",
                current === r.value ? "font-semibold text-gold" : "text-charcoal"
              )}
            >
              {r.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductFilters() {
  const categories = [
    { value: "guitars", label: "Guitars", count: 6 },
    { value: "basses", label: "Basses", count: 4 },
    { value: "amps-and-effects", label: "Amps & Effects", count: 5 },
    { value: "drums", label: "Drums", count: 5 },
    { value: "keyboards", label: "Keyboards", count: 5 },
    { value: "live-sound", label: "Live Sound", count: 5 },
    { value: "recording", label: "Recording", count: 6 },
  ];

  const brands = [
    { value: "fender", label: "Fender", count: 5 },
    { value: "gibson", label: "Gibson", count: 2 },
    { value: "yamaha", label: "Yamaha", count: 10 },
    { value: "roland", label: "Roland", count: 7 },
    { value: "shure", label: "Shure", count: 4 },
    { value: "zildjian", label: "Zildjian", count: 2 },
    { value: "marshall", label: "Marshall", count: 2 },
    { value: "akai", label: "AKAI Professional", count: 2 },
  ];

  return (
    <aside className="space-y-6">
      <FilterSection title="Category" options={categories} paramName="category" />
      <FilterSection title="Brand" options={brands} paramName="brand" />
      <PriceFilter />
    </aside>
  );
}
