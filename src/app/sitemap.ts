import { products, categories } from "@/lib/data/products";

export const dynamic = "force-static";

export default function sitemap(): { url: string; lastModified: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://noblemanmusical.com";

  const routes = [
    { url: baseUrl, lastModified: new Date().toISOString(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date().toISOString(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/churches`, lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/radio-stations`, lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/schools`, lastModified: new Date().toISOString(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryPages, ...productPages];
}
