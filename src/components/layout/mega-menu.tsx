"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { megaMenuData, featuredBrands, type MegaMenuCategory } from "@/lib/data/mega-menu";
import { cn } from "@/lib/utils/cn";

function MegaMenuPanel({ category }: { category: MegaMenuCategory }) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 border-t border-line bg-white">
      <div className="container-wide mx-auto">
        <div className="flex gap-8 py-8">
          {/* Subcategory columns */}
          <div className="flex flex-1 gap-8">
            {category.columns.map((col) => (
              <div key={col.title} className="min-w-[180px]">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-2 text-sm text-body transition-colors hover:text-gold"
                      >
                        <span className="h-1 w-1 rounded-full bg-muted/40 transition-colors group-hover:bg-gold" />
                        {item.label}
                        {item.badge && (
                          <span className="bg-taupe px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Brands sidebar */}
          <div className="w-[200px] shrink-0 border-l border-line pl-8">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy">
              Top Brands
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.name}
                  href={brand.href}
                  className="group flex flex-col items-center border border-line px-3 py-2.5 transition-all hover:border-gold"
                >
                  <span className="text-[13px] font-semibold text-navy transition-colors group-hover:text-gold">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/brands"
              className="text-underline-gold mt-4 block text-center text-xs font-semibold text-navy"
            >
              View All Brands
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MegaMenu() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navRef = useRef<HTMLElement | null>(null);

  const handleEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIndex(index);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
    }, 200);
  };

  return (
    <nav
      ref={navRef}
      className="relative border-b border-line bg-white"
      onMouseLeave={handleLeave}
    >
      <div className="container-wide mx-auto">
        <ul className="flex items-center gap-1">
          {megaMenuData.map((category, index) => (
            <li
              key={category.label}
              className="relative"
              onMouseEnter={() => handleEnter(index)}
            >
              <Link
                href={category.href}
                className={cn(
                  "relative block px-3.5 py-3 text-[15px] font-medium transition-colors",
                  activeIndex === index
                    ? "text-gold"
                    : "text-navy hover:text-gold"
                )}
              >
                {category.label}
                {activeIndex === index && (
                  <span className="absolute inset-x-3.5 bottom-0 h-0.5 bg-gold" />
                )}
              </Link>
            </li>
          ))}

          {/* Separator + extra links */}
          <li className="ml-2 h-5 w-px bg-line" />
          <li>
            <Link
              href="/shop?deals=true"
              className="block px-3.5 py-3 text-[15px] font-medium text-kente-red transition-colors hover:opacity-70"
            >
              Deals
            </Link>
          </li>
          <li>
            <Link
              href="/shop?condition=used"
              className="block px-3.5 py-3 text-[15px] font-medium text-navy transition-colors hover:text-gold"
            >
              Used
            </Link>
          </li>
          <li>
            <Link
              href="/b2b"
              className="block px-3.5 py-3 text-[15px] font-bold text-gold transition-colors hover:text-navy"
            >
              B2B Quotes
            </Link>
          </li>
        </ul>
      </div>

      {/* Mega menu panel — inside nav so hover area covers both */}
      {activeIndex !== null && (
        <MegaMenuPanel category={megaMenuData[activeIndex]} />
      )}
    </nav>
  );
}
