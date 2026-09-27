import { Suspense } from "react";
import type { Metadata } from "next";
import { GoldDivider } from "@/components/brand/gold-divider";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ShopContent } from "./shop-content";

export const metadata: Metadata = {
  title: "Shop All Instruments",
  description: "Browse Ghana's finest collection of musical instruments — guitars, keyboards, drums, PA systems, studio gear, and traditional Ghanaian instruments.",
};

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-cream pt-chrome">
      {/* Header */}
      <div className="bg-navy-deep py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <RevealOnScroll>
            <span className="font-accent text-sm italic tracking-widest text-gold-light">
              Our Collection
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">
              Shop All Instruments
            </h1>
            <GoldDivider className="mt-4 !mx-0" width={60} />
            <p className="mt-4 max-w-2xl text-sm text-cream/60">
              Discover premium instruments from world-renowned brands. From Yamaha guitars to traditional Ghanaian drums — find your perfect sound.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      {/* Shop Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <Suspense>
          <ShopContent perPage={ITEMS_PER_PAGE} />
        </Suspense>
      </div>
    </div>
  );
}
