import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/b2b",
    "/brands",
    "/login",
    "/register",
  ];

  // Static pages
  const staticEntries = staticPages.map((page) => ({
    url: `${SITE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1.0 : 0.8,
  }));

  // Product pages (placeholder — in production, fetch from DB)
  const productSlugs = [
    "fender-player-stratocaster",
    "yamaha-c40-classical",
    "shure-sm58",
    "yamaha-p-125",
    "roland-fp-30x",
    "gibson-les-paul-standard",
    "fender-acoustic-fa-115",
    "yamaha-fg800-acoustic",
    "gibson-sg-standard",
    "pearl-export-5pc",
    "audio-technica-at2020",
    "boss-ds-1-distortion",
    "fender-rumble-100",
    "yamaha-stage-custom",
    "shure-sm57",
    "sennheiser-hd-280-pro",
  ];

  const productEntries = productSlugs.map((slug) => ({
    url: `${SITE_URL}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...productEntries];
}
