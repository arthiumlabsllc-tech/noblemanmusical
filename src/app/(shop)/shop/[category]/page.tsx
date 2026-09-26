import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data/products";
import Link from "next/link";
import { GoldDivider } from "@/components/brand/gold-divider";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Suspense } from "react";
import { ShopContent } from "../shop-content";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };
  return { title: `${cat.name} — Shop`, description: cat.description };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
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
          <ShopContent perPage={12} />
        </Suspense>
      </div>
    </div>
  );
}
