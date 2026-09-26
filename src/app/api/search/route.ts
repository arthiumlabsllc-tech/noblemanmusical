import { NextRequest, NextResponse } from "next/server";
import { searchTypesense } from "@/lib/search/typesense";
import { searchProducts } from "@/lib/data/products";
import { limits, rateLimitResponse } from "@/lib/security/rate-limit";

/**
 * GET /api/search?q=...&category=...&brand=...&sort=...&page=...
 *
 * Tries Typesense first; falls back to local DB search if Typesense is unavailable.
 */
export async function GET(request: NextRequest) {
  // Rate limit
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = limits.search(ip);
  if (!rl.success) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((rl.reset - Date.now()) / 1000).toString(),
        ...rateLimitResponse(rl),
      },
    });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "20");

  if (!q.trim() && !category && !brand) {
    return NextResponse.json({
      hits: [],
      total: 0,
      page: 1,
      totalPages: 0,
    });
  }

  // Try Typesense first
  try {
    const result = await searchTypesense({
      q,
      page,
      perPage,
      category,
      brand,
      sort,
    });
    return NextResponse.json(result);
  } catch {
    // Typesense not available — fall back to local search
    const localResults = searchProducts(q);

    // Filter by category if specified
    const filtered = category
      ? localResults.filter((p) => p.categorySlug === category)
      : localResults;

    // Sort
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);

    // Paginate
    const start = (page - 1) * perPage;
    const paginated = sorted.slice(start, start + perPage);

    return NextResponse.json({
      hits: paginated.map((p) => ({
        id: p.slug,
        name: p.name,
        slug: p.slug,
        description: p.description ?? "",
        category: p.categoryName,
        categorySlug: p.categorySlug,
        brand: p.brand,
        brandSlug: "",
        price: p.price,
        image: p.images[0] ?? "",
        rating: p.rating,
        stock: p.stock,
        isFeatured: p.isFeatured,
      })),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / perPage),
    });
  }
}
