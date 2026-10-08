/**
 * Storefront data-access layer.
 *
 * Every function queries the real Postgres (Neon) schema via Drizzle and maps
 * rows into the plain shapes the UI components expect. When the database is
 * not configured (no DATABASE_URL) or a query throws, each function falls back
 * to the local seed-equivalent mock data so the site keeps rendering during
 * development. The moment a real connection string is present, the DB path is
 * used automatically — no page changes required.
 */
import { and, asc, count, desc, eq, gte, like, lte, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { brands, categories, products } from "@/lib/db/schema";
import { productImages } from "@/lib/data/product-images";

// ── Public types ────────────────────────────────────────────────────────────

export type StorefrontProduct = {
  slug: string;
  name: string;
  price: number;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  isFeatured: boolean;
  stock: number;
  image?: string;
};

export type ProductDetail = StorefrontProduct & {
  description: string | null;
  longDescription: string | null;
  compareAtPrice: number | null;
  specs: Record<string, string>;
  tags: string[];
};

export type CategorySummary = {
  slug: string;
  name: string;
  description: string;
  productCount: number;
};

export type BrandSummary = { slug: string; name: string };

export type ProductQuery = {
  categorySlug?: string;
  brandSlug?: string;
  featured?: boolean;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "name" | "newest";
  limit?: number;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function imageFor(slug: string, stored?: string[] | null): string | undefined {
  if (stored && stored.length > 0) return stored[0];
  return productImages[slug];
}

function toNumber(v: string | number | null): number {
  return typeof v === "number" ? v : Number(v ?? 0);
}

// ── Fallback (mock) data — mirrors src/lib/db/seed.ts ─────────────────────────

type FbProduct = {
  slug: string;
  name: string;
  price: number;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  isFeatured: boolean;
  stock: number;
};

const FALLBACK_PRODUCTS: FbProduct[] = [
  { slug: "fender-player-stratocaster", name: "Fender Player Stratocaster", price: 4599.99, brand: "Fender", brandSlug: "fender", category: "Guitars", categorySlug: "guitars", isFeatured: true, stock: 12 },
  { slug: "fender-acoustic-fa-115", name: "Fender FA-115 Acoustic", price: 1299.99, brand: "Fender", brandSlug: "fender", category: "Guitars", categorySlug: "guitars", isFeatured: false, stock: 20 },
  { slug: "gibson-les-paul-standard", name: "Gibson Les Paul Standard '50s", price: 12999.99, brand: "Gibson", brandSlug: "gibson", category: "Guitars", categorySlug: "guitars", isFeatured: true, stock: 3 },
  { slug: "yamaha-c40-classical", name: "Yamaha C40 Classical Guitar", price: 699.99, brand: "Yamaha", brandSlug: "yamaha", category: "Guitars", categorySlug: "guitars", isFeatured: false, stock: 25 },
  { slug: "yamaha-fg800-acoustic", name: "Yamaha FG800 Acoustic", price: 1499.99, brand: "Yamaha", brandSlug: "yamaha", category: "Guitars", categorySlug: "guitars", isFeatured: false, stock: 15 },
  { slug: "gibson-sg-standard", name: "Gibson SG Standard '61", price: 8499.99, brand: "Gibson", brandSlug: "gibson", category: "Guitars", categorySlug: "guitars", isFeatured: false, stock: 4 },
  { slug: "fender-player-jazz-bass", name: "Fender Player Jazz Bass", price: 4299.99, brand: "Fender", brandSlug: "fender", category: "Basses", categorySlug: "basses", isFeatured: false, stock: 8 },
  { slug: "yamaha-trbx304", name: "Yamaha TRBX304 Bass", price: 2199.99, brand: "Yamaha", brandSlug: "yamaha", category: "Basses", categorySlug: "basses", isFeatured: false, stock: 10 },
  { slug: "fender-player-precision-bass", name: "Fender Player Precision Bass", price: 4299.99, brand: "Fender", brandSlug: "fender", category: "Basses", categorySlug: "basses", isFeatured: true, stock: 6 },
  { slug: "yamaha-trbx174", name: "Yamaha TRBX174 Bass", price: 1099.99, brand: "Yamaha", brandSlug: "yamaha", category: "Basses", categorySlug: "basses", isFeatured: false, stock: 18 },
  { slug: "marshall-dsl20cr", name: "Marshall DSL20CR Combo", price: 3499.99, brand: "Marshall", brandSlug: "marshall", category: "Amps & Effects", categorySlug: "amps-and-effects", isFeatured: false, stock: 7 },
  { slug: "fender-blues-junior", name: "Fender Blues Junior IV", price: 3999.99, brand: "Fender", brandSlug: "fender", category: "Amps & Effects", categorySlug: "amps-and-effects", isFeatured: true, stock: 5 },
  { slug: "yamaha-thr10ii", name: "Yamaha THR10II Desktop Amp", price: 1899.99, brand: "Yamaha", brandSlug: "yamaha", category: "Amps & Effects", categorySlug: "amps-and-effects", isFeatured: false, stock: 12 },
  { slug: "marshall-guvs2", name: "Marshall Guv'ner DS-1 Pedal", price: 549.99, brand: "Marshall", brandSlug: "marshall", category: "Amps & Effects", categorySlug: "amps-and-effects", isFeatured: false, stock: 30 },
  { slug: "roland-cube-20", name: "Roland CUBE-20GX", price: 899.99, brand: "Roland", brandSlug: "roland", category: "Amps & Effects", categorySlug: "amps-and-effects", isFeatured: false, stock: 15 },
  { slug: "yamaha-stage-custom", name: "Yamaha Stage Custom Birch 5pc", price: 5999.99, brand: "Yamaha", brandSlug: "yamaha", category: "Drums", categorySlug: "drums", isFeatured: true, stock: 4 },
  { slug: "zildjian-a-custom-cymbal-set", name: "Zildjian A Custom Cymbal Set", price: 4299.99, brand: "Zildjian", brandSlug: "zildjian", category: "Drums", categorySlug: "drums", isFeatured: false, stock: 6 },
  { slug: "roland-td-17kv", name: "Roland TD-17KV Electronic Kit", price: 7499.99, brand: "Roland", brandSlug: "roland", category: "Drums", categorySlug: "drums", isFeatured: false, stock: 3 },
  { slug: "yamaha-ryde-tompad", name: "Yamaha Ryde Tom Pad", price: 349.99, brand: "Yamaha", brandSlug: "yamaha", category: "Drums", categorySlug: "drums", isFeatured: false, stock: 20 },
  { slug: "zildjian-l80-low-volume", name: "Zildjian L80 Low Volume Set", price: 1299.99, brand: "Zildjian", brandSlug: "zildjian", category: "Drums", categorySlug: "drums", isFeatured: false, stock: 10 },
  { slug: "yamaha-p-125", name: "Yamaha P-125 Digital Piano", price: 3299.99, brand: "Yamaha", brandSlug: "yamaha", category: "Keyboards", categorySlug: "keyboards", isFeatured: false, stock: 8 },
  { slug: "roland-fp-30x", name: "Roland FP-30X Digital Piano", price: 3799.99, brand: "Roland", brandSlug: "roland", category: "Keyboards", categorySlug: "keyboards", isFeatured: true, stock: 6 },
  { slug: "akai-mpk-mini-mk3", name: "AKAI MPK mini mk3", price: 699.99, brand: "AKAI Professional", brandSlug: "akai", category: "Keyboards", categorySlug: "keyboards", isFeatured: false, stock: 20 },
  { slug: "yamaha-psr-e373", name: "Yamaha PSR-E373 Keyboard", price: 1299.99, brand: "Yamaha", brandSlug: "yamaha", category: "Keyboards", categorySlug: "keyboards", isFeatured: false, stock: 15 },
  { slug: "roland-juno-ds61", name: "Roland JUNO-DS61 Synthesizer", price: 4499.99, brand: "Roland", brandSlug: "roland", category: "Keyboards", categorySlug: "keyboards", isFeatured: false, stock: 4 },
  { slug: "shure-sm58", name: "Shure SM58 Vocal Microphone", price: 549.99, brand: "Shure", brandSlug: "shure", category: "Live Sound", categorySlug: "live-sound", isFeatured: true, stock: 40 },
  { slug: "shure-sm57", name: "Shure SM57 Instrument Mic", price: 549.99, brand: "Shure", brandSlug: "shure", category: "Live Sound", categorySlug: "live-sound", isFeatured: false, stock: 35 },
  { slug: "yamaha-stagepas-400i", name: "Yamaha STAGEPAS 400i", price: 5999.99, brand: "Yamaha", brandSlug: "yamaha", category: "Live Sound", categorySlug: "live-sound", isFeatured: false, stock: 3 },
  { slug: "roland-cube-street-ex", name: "Roland CUBE Street EX", price: 3299.99, brand: "Roland", brandSlug: "roland", category: "Live Sound", categorySlug: "live-sound", isFeatured: false, stock: 5 },
  { slug: "shure-svx88", name: "Shure SVX88 Wireless Dual", price: 3999.99, brand: "Shure", brandSlug: "shure", category: "Live Sound", categorySlug: "live-sound", isFeatured: false, stock: 4 },
  { slug: "roland-rubix22", name: "Roland Rubix22 Audio Interface", price: 899.99, brand: "Roland", brandSlug: "roland", category: "Recording", categorySlug: "recording", isFeatured: false, stock: 12 },
  { slug: "yamaha-hs5-monitor", name: "Yamaha HS5 Studio Monitor", price: 1099.99, brand: "Yamaha", brandSlug: "yamaha", category: "Recording", categorySlug: "recording", isFeatured: false, stock: 16 },
  { slug: "shure-sm7b", name: "Shure SM7B Microphone", price: 2199.99, brand: "Shure", brandSlug: "shure", category: "Recording", categorySlug: "recording", isFeatured: true, stock: 8 },
  { slug: "akai-force", name: "AKAI Force Standalone Production", price: 4999.99, brand: "AKAI Professional", brandSlug: "akai", category: "Recording", categorySlug: "recording", isFeatured: false, stock: 3 },
  { slug: "yamaha-ag03-mk2", name: "Yamaha AG03-MK2 Mixer", price: 1299.99, brand: "Yamaha", brandSlug: "yamaha", category: "Recording", categorySlug: "recording", isFeatured: false, stock: 10 },
  { slug: "roland-quad-capture", name: "Roland QUAD-CAPTURE", price: 1899.99, brand: "Roland", brandSlug: "roland", category: "Recording", categorySlug: "recording", isFeatured: false, stock: 6 },
];

const FALLBACK_CATEGORIES: { slug: string; name: string; description: string }[] = [
  { slug: "guitars", name: "Guitars", description: "Acoustic, electric, and classical guitars" },
  { slug: "basses", name: "Basses", description: "Electric and acoustic bass guitars" },
  { slug: "amps-and-effects", name: "Amps & Effects", description: "Amplifiers and effect pedals" },
  { slug: "drums", name: "Drums", description: "Acoustic, electronic drums and percussion" },
  { slug: "keyboards", name: "Keyboards", description: "Pianos, synthesizers, and MIDI controllers" },
  { slug: "live-sound", name: "Live Sound", description: "PA systems, mixers, microphones for live use" },
  { slug: "recording", name: "Recording", description: "Audio interfaces, monitors, and studio gear" },
];

function fallbackToCard(p: FbProduct): StorefrontProduct {
  return { ...p, image: productImages[p.slug] };
}

function sortFallback(list: FbProduct[], sort?: ProductQuery["sort"]): FbProduct[] {
  const arr = [...list];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "name":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    case "newest":
    default:
      return arr.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

function applyFallbackQuery(q: ProductQuery): StorefrontProduct[] {
  let list = FALLBACK_PRODUCTS;
  if (q.categorySlug) list = list.filter((p) => p.categorySlug === q.categorySlug);
  if (q.brandSlug) list = list.filter((p) => p.brandSlug === q.brandSlug);
  if (q.featured) list = list.filter((p) => p.isFeatured);
  if (q.priceMin != null) list = list.filter((p) => p.price >= q.priceMin!);
  if (q.priceMax != null) list = list.filter((p) => p.price <= q.priceMax!);
  if (q.search) {
    const s = q.search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)
    );
  }
  list = sortFallback(list, q.sort);
  if (q.limit) list = list.slice(0, q.limit);
  return list.map(fallbackToCard);
}

// ── Queries ────────────────────────────────────────────────────────────────

const productSelect = {
  slug: products.slug,
  name: products.name,
  price: products.price,
  compareAtPrice: products.compareAtPrice,
  description: products.description,
  longDescription: products.longDescription,
  stock: products.stock,
  isFeatured: products.isFeatured,
  specs: products.specs,
  tags: products.tags,
  images: products.images,
  createdAt: products.createdAt,
  brand: brands.name,
  brandSlug: brands.slug,
  category: categories.name,
  categorySlug: categories.slug,
};

function rowToDetail(row: any): ProductDetail {
  return {
    slug: row.slug,
    name: row.name,
    price: toNumber(row.price),
    compareAtPrice: row.compareAtPrice == null ? null : toNumber(row.compareAtPrice),
    description: row.description ?? null,
    longDescription: row.longDescription ?? null,
    brand: row.brand,
    brandSlug: row.brandSlug,
    category: row.category,
    categorySlug: row.categorySlug,
    stock: row.stock,
    isFeatured: row.isFeatured,
    specs: (row.specs ?? {}) as Record<string, string>,
    tags: (row.tags ?? []) as string[],
    image: imageFor(row.slug, row.images),
  };
}

function rowToCard(row: any): StorefrontProduct {
  return {
    slug: row.slug,
    name: row.name,
    price: toNumber(row.price),
    brand: row.brand,
    brandSlug: row.brandSlug,
    category: row.category,
    categorySlug: row.categorySlug,
    stock: row.stock,
    isFeatured: row.isFeatured,
    image: imageFor(row.slug, row.images),
  };
}

/** Filtered, sorted, paginated product list. */
export async function getProducts(q: ProductQuery = {}): Promise<StorefrontProduct[]> {
  if (!isDatabaseConfigured()) return applyFallbackQuery(q);
  try {
    const conds = [eq(products.isActive, true)];
    if (q.categorySlug) conds.push(eq(categories.slug, q.categorySlug));
    if (q.brandSlug) conds.push(eq(brands.slug, q.brandSlug));
    if (q.featured) conds.push(eq(products.isFeatured, true));
    if (q.priceMin != null) conds.push(gte(products.price, String(q.priceMin)));
    if (q.priceMax != null) conds.push(lte(products.price, String(q.priceMax)));
    if (q.search) {
      const pattern = `%${q.search}%`;
      const searchCond = or(like(products.name, pattern), like(products.description, pattern));
      if (searchCond) conds.push(searchCond);
    }

    const order =
      q.sort === "price-asc"
        ? [asc(products.price)]
        : q.sort === "price-desc"
        ? [desc(products.price)]
        : q.sort === "name"
        ? [asc(products.name)]
        : q.sort === "newest"
        ? [desc(products.createdAt)]
        : [desc(products.isFeatured), desc(products.createdAt)];

    const query = db
      .select(productSelect)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conds))
      .orderBy(...order);

    const rows = q.limit ? await query.limit(q.limit) : await query;
    return rows.map(rowToCard);
  } catch (err) {
    console.error("[storefront] getProducts failed, using fallback:", err);
    return applyFallbackQuery(q);
  }
}

export async function getFeaturedProducts(limit = 8): Promise<StorefrontProduct[]> {
  return getProducts({ featured: true, sort: "featured", limit });
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  if (!isDatabaseConfigured()) {
    const fb = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (!fb) return null;
    return {
      ...fallbackToCard(fb),
      description: `The ${fb.name} — premium quality from ${fb.brand}.`,
      longDescription: null,
      compareAtPrice: null,
      specs: {},
      tags: [],
    };
  }
  try {
    const rows = await db
      .select(productSelect)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug))
      .limit(1);
    if (rows.length === 0) return null;
    return rowToDetail(rows[0]);
  } catch (err) {
    console.error("[storefront] getProductBySlug failed:", err);
    return null;
  }
}

export async function getCategories(): Promise<CategorySummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_CATEGORIES.map((c) => ({
      ...c,
      productCount: FALLBACK_PRODUCTS.filter((p) => p.categorySlug === c.slug).length,
    }));
  }
  try {
    const rows = await db
      .select({
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        sortOrder: categories.sortOrder,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
      .groupBy(categories.id, categories.slug, categories.name, categories.description, categories.sortOrder)
      .orderBy(asc(categories.sortOrder));
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      description: r.description ?? "",
      productCount: Number(r.productCount),
    }));
  } catch (err) {
    console.error("[storefront] getCategories failed, using fallback:", err);
    return FALLBACK_CATEGORIES.map((c) => ({
      ...c,
      productCount: FALLBACK_PRODUCTS.filter((p) => p.categorySlug === c.slug).length,
    }));
  }
}

export async function getBrands(): Promise<BrandSummary[]> {
  if (!isDatabaseConfigured()) {
    const seen = new Map<string, string>();
    for (const p of FALLBACK_PRODUCTS) seen.set(p.brandSlug, p.brand);
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }
  try {
    const rows = await db
      .select({ slug: brands.slug, name: brands.name })
      .from(brands)
      .orderBy(asc(brands.name));
    return rows;
  } catch (err) {
    console.error("[storefront] getBrands failed, using fallback:", err);
    const seen = new Map<string, string>();
    for (const p of FALLBACK_PRODUCTS) seen.set(p.brandSlug, p.brand);
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4
): Promise<StorefrontProduct[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_PRODUCTS.filter(
      (p) => p.categorySlug === categorySlug && p.slug !== excludeSlug
    )
      .slice(0, limit)
      .map(fallbackToCard);
  }
  try {
    const rows = await db
      .select(productSelect)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(categories.slug, categorySlug),
          eq(products.isActive, true),
          ne(products.slug, excludeSlug)
        )
      )
      .limit(limit);
    return rows.map(rowToCard);
  } catch (err) {
    console.error("[storefront] getRelatedProducts failed, using fallback:", err);
    return FALLBACK_PRODUCTS.filter(
      (p) => p.categorySlug === categorySlug && p.slug !== excludeSlug
    )
      .slice(0, limit)
      .map(fallbackToCard);
  }
}
