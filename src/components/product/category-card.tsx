import Link from "next/link";

interface CategoryCardProps {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
}

// Delicate 1px line-art instrument icons (stroke = currentColor / gold)
const icons: Record<string, React.ReactNode> = {
  guitars: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3.5l6 6M16 5l-1.5 1.5M4 20l4-4M13.5 6.5l-3 3a5 5 0 00-6 6c-1 1-1 2-2 3.5 1.5-1 2.5-1 3.5-2a5 5 0 006-6l3-3-2-2z" />
  ),
  basses: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 4l5 5M17 4.5L6 15.5M6 15.5a4 4 0 103 3M13 6l2 2" />
  ),
  "amps-and-effects": (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10" />
  ),
  drums: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10c0 1.7 3.1 3 7 3s7-1.3 7-3-3.1-3-7-3-7 1.3-7 3zM5 10v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5M17 8l3-3M6 15l-2 4" />
  ),
  keyboards: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16v8H4zM8 8v5M12 8v5M16 8v5M4 13h16" />
  ),
  "live-sound": (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v10m0 0a3 3 0 013 3m-3-3a3 3 0 00-3 3M6 21h12M12 13v5M8 6a4 4 0 008 0" />
  ),
  recording: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3zM6 11a6 6 0 0012 0M12 17v4M9 21h6" />
  ),
};

function CatIcon({ slug }: { slug: string }) {
  return (
    <svg className="h-11 w-11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      {icons[slug] ?? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z" />
      )}
    </svg>
  );
}

export function CategoryCard({ slug, name, description, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group flex flex-col items-center text-center sm:items-start sm:text-left"
    >
      <span className="cat-icon-box">
        <CatIcon slug={slug} />
      </span>
      <h3 className="text-underline-gold mt-6 text-xl font-semibold leading-none text-navy lg:text-2xl">
        {name}
      </h3>
      {productCount !== undefined && (
        <span className="mt-2.5 block text-sm text-body">
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </span>
      )}
      {description && (
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-body">{description}</p>
      )}
    </Link>
  );
}
