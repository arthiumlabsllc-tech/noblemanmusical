import Typesense from "typesense";
import type { Client as TypesenseClient } from "typesense";
import { db } from "@/lib/db";
import { products, categories, brands } from "@/lib/db/schema";

/* ═══════════════════════════════════════════════════════════
   Typesense Client
   ═══════════════════════════════════════════════════════════ */

const TYPESENSE_NODES = (process.env.TYPESENSE_NODES ?? "http://localhost:8108").split(",");

function createClient() {
  return new Typesense.Client({
    nodes: TYPESENSE_NODES.map((node) => {
      const url = new URL(node);
      return {
        host: url.hostname,
        port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
        protocol: url.protocol.replace(":", ""),
      };
    }),
    apiKey: process.env.TYPESENSE_API_KEY ?? "xyz",
    connectionTimeoutSeconds: 5,
  });
}

// Lazy client — only created when actually used
let _client: TypesenseClient | null = null;
export function getTypesenseClient(): TypesenseClient {
  if (!_client) _client = createClient();
  return _client;
}

/* ═══════════════════════════════════════════════════════════
   Collection Schema
   ═══════════════════════════════════════════════════════════ */

export const PRODUCTS_COLLECTION = "products";

export const productSchema = {
  name: PRODUCTS_COLLECTION,
  fields: [
    { name: "id", type: "string" as const },
    { name: "name", type: "string" as const },
    { name: "slug", type: "string" as const },
    { name: "description", type: "string" as const },
    { name: "category", type: "string" as const, facet: true },
    { name: "categorySlug", type: "string" as const, facet: true },
    { name: "brand", type: "string" as const, facet: true },
    { name: "brandSlug", type: "string" as const, facet: true },
    { name: "price", type: "int32" as const },
    { name: "image", type: "string" as const, optional: true },
    { name: "rating", type: "float" as const },
    { name: "stock", type: "int32" as const },
    { name: "isFeatured", type: "bool" as const },
    { name: "tags", type: "string[]" as const, facet: true },
  ],
  default_sorting_field: "rating",
};

/* ═══════════════════════════════════════════════════════════
   Sync products from DB → Typesense
   ═══════════════════════════════════════════════════════════ */

export async function syncProductsToTypesense() {
  const client = getTypesenseClient();

  // Ensure collection exists
  try {
    await client.collections(PRODUCTS_COLLECTION).retrieve();
  } catch {
    await client.collections().create(productSchema);
  }

  // Fetch all products with relations
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      stock: products.stock,
      isFeatured: products.isFeatured,
      categoryId: products.categoryId,
      brandId: products.brandId,
      tags: products.tags,
    })
    .from(products);

  // Resolve category and brand names
  const allCategories = await db.select().from(categories);
  const allBrands = await db.select().from(brands);
  const catMap = new Map(allCategories.map((c) => [c.id, c]));
  const brandMap = new Map(allBrands.map((b) => [b.id, b]));

  const documents = allProducts.map((p) => {
    const cat = catMap.get(p.categoryId);
    const brand = brandMap.get(p.brandId);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? "",
      category: cat?.name ?? "",
      categorySlug: cat?.slug ?? "",
      brand: brand?.name ?? "",
      brandSlug: brand?.slug ?? "",
      price: p.price,
      image: (p.images as string[])[0] ?? "",
      rating: 0,
      stock: p.stock,
      isFeatured: p.isFeatured,
      tags: (p.tags as string[]) ?? [],
    };
  });

  // Upsert in batches
  const BATCH_SIZE = 100;
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    await client
      .collections(PRODUCTS_COLLECTION)
      .documents()
      .import(batch, { action: "upsert" });
  }

  return { imported: documents.length };
}

/* ═══════════════════════════════════════════════════════════
   Search query
   ═══════════════════════════════════════════════════════════ */

export interface SearchParams {
  q: string;
  page?: number;
  perPage?: number;
  category?: string;
  brand?: string;
  sort?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  brand: string;
  brandSlug: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  isFeatured: boolean;
}

export async function searchTypesense(params: SearchParams): Promise<{
  hits: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const client = getTypesenseClient();
  const { q, page = 1, perPage = 20, category, brand, sort } = params;

  const filterBy: string[] = [];
  if (category) filterBy.push(`categorySlug:=${category}`);
  if (brand) filterBy.push(`brandSlug:=${brand}`);

  const sortBy = sort === "price-asc"
    ? "price:asc"
    : sort === "price-desc"
      ? "price:desc"
      : sort === "newest"
        ? "_text_match:desc"
        : "rating:desc";

  const results = await client
    .collections(PRODUCTS_COLLECTION)
    .documents()
    .search({
      q,
      query_by: "name,description,brand,category,tags",
      filter_by: filterBy.join(" && "),
      sort_by: sortBy,
      page,
      per_page: perPage,
    });

  const hits = (results.hits ?? []).map(
    (hit: { document: unknown }) => hit.document as unknown as SearchResult
  );

  return {
    hits,
    total: results.found ?? 0,
    page,
    totalPages: Math.ceil((results.found ?? 0) / perPage),
  };
}
