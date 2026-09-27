import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

/**
 * Vercel exposes every preview deployment on a public `*.vercel.app` URL, and
 * those URLs are crawlable. Without this guard, each preview branch risks
 * being indexed and competing with production.
 */
const isProduction =
  process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      // No sitemap either — pointing a crawler at it defeats the block.
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/account/",
          "/api/",
          "/checkout",
          "/cart",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/search",
          "/offline",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
