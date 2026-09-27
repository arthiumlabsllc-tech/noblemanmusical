import type { MetadataRoute } from "next";
import { products, categories, getProductsByCategory } from "@/lib/data/products";
import { getAllPosts } from "@/lib/content/blog";
import { SITE_URL } from "@/lib/seo/config";

export const dynamic = "force-static";

type Entry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  opts: Pick<Entry, "lastModified" | "changeFrequency" | "priority">
): Entry {
  return { url: `${SITE_URL}${path}`, ...opts };
}

/**
 * Everything listed here must be indexable, and everything indexable must be
 * listed — /search, /offline, /account, /checkout and /admin are excluded
 * because robots.ts and the per-route `robots` metadata now noindex them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: Entry[] = [
    entry("", { lastModified: now, changeFrequency: "daily", priority: 1 }),
    entry("/shop", { lastModified: now, changeFrequency: "daily", priority: 0.9 }),
    entry("/about", { lastModified: now, changeFrequency: "monthly", priority: 0.5 }),
    entry("/contact", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    entry("/track", { lastModified: now, changeFrequency: "monthly", priority: 0.4 }),
    entry("/churches", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    entry("/radio-stations", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    entry("/schools", { lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    entry("/blog", { lastModified: now, changeFrequency: "weekly", priority: 0.6 }),
    // Policy pages earn their place: they are trust signals shoppers check
    // before a high-value purchase, and Google surfaces them in sitelinks.
    entry("/shipping", { lastModified: now, changeFrequency: "yearly", priority: 0.3 }),
    entry("/returns", { lastModified: now, changeFrequency: "yearly", priority: 0.3 }),
    entry("/privacy", { lastModified: now, changeFrequency: "yearly", priority: 0.2 }),
    entry("/terms", { lastModified: now, changeFrequency: "yearly", priority: 0.2 }),
    entry("/cookies", { lastModified: now, changeFrequency: "yearly", priority: 0.2 }),
    entry("/accessibility", { lastModified: now, changeFrequency: "yearly", priority: 0.2 }),
  ];

  // Categories outrank their products but are refreshed less often. Only emit a
  // category that actually has products — an empty one is a thin doorway page.
  const categoryPages: Entry[] = categories
    .filter((cat) => getProductsByCategory(cat.slug).length > 0)
    .map((cat) =>
      entry(`/shop/${cat.slug}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    );

  const productPages: Entry[] = products.map((product) =>
    entry(`/product/${product.slug}`, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: product.isFeatured ? 0.7 : 0.6,
    })
  );

  // Blog dates are real publication dates rather than the build timestamp, so
  // Google can tell a genuinely new article from a redeploy.
  const blogPages: Entry[] = getAllPosts().map((post) =>
    entry(`/blog/${post.slug}`, {
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.5,
    })
  );

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
