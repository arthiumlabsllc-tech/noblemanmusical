import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getProductsByCategory } from "@/lib/data/products";
import Link from "next/link";
import { GoldDivider } from "@/components/brand/gold-divider";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import { collectionPageLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { formatGHS } from "@/lib/utils";
import { Suspense } from "react";
import { ShopContent } from "../shop-content";
import { findDepartment } from "@/lib/data/storefront-nav";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) {
    return { title: "Category Not Found", robots: { index: false, follow: false } };
  }

  const canonical = `/shop/${cat.slug}`;
  const items = getProductsByCategory(cat.slug);
  // A real price floor is the strongest extra line in a category snippet, and
  // it is computed from the catalogue rather than asserted.
  const from = items.length > 0 ? Math.min(...items.map((p) => p.price)) : null;
  const description = `${cat.description}. ${cat.productCount} in stock from ${
    from !== null ? formatGHS(from) : "see prices"
  }, delivered across Ghana from Zongo Lane, Accra.`;

  return {
    title: `${cat.name} for Sale in Ghana`,
    description,
    keywords: [cat.name, `${cat.name} Ghana`, `${cat.name} Accra`, "musical instruments"],
    // Canonical without any filter string: ?brand=&sort=&page= would otherwise
    // create hundreds of indexable duplicates of the same category.
    alternates: { canonical },
    openGraph: { title: `${cat.name} — Nobleman Musical Center`, description, url: canonical },
    twitter: { card: "summary_large_image", title: `${cat.name}`, description },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const items = getProductsByCategory(cat.slug);

  return (
    <div className="min-h-screen bg-cream pt-chrome">
      <JsonLd
        data={[
          collectionPageLd(cat, items),
          breadcrumbLd([
            { name: "Shop", path: "/shop" },
            { name: cat.name, path: `/shop/${cat.slug}` },
          ]),
        ]}
      />
      <div className="bg-navy-deep py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <RevealOnScroll>
            <nav className="mb-4 flex items-center gap-2 text-xs text-cream/60">
              <Link href="/" className="hover:text-cream/60">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-cream/60">Shop</Link>
              <span>/</span>
              <span className="text-cream/70">{cat.name}</span>
            </nav>
            <span className="font-accent text-sm italic tracking-widest text-gold-light">
              {cat.productCount} Products
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">
              {cat.name}
            </h1>
            <GoldDivider className="mt-4 !mx-0" width={60} />
            <p className="mt-4 max-w-2xl text-sm text-cream/60">{cat.description}</p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <Suspense>
          <ShopContent
            perPage={12}
            categorySlug={cat.slug}
            department={findDepartment(cat.slug)}
          />
        </Suspense>
      </div>
    </div>
  );
}
