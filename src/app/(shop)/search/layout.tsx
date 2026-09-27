import type { Metadata } from "next";

/**
 * Server layout whose only job is metadata.
 *
 * `search/page.tsx` is a client component, and Next.js does not allow exporting
 * `metadata` from one, so the robots directive has to live in this segment's
 * server layout instead.
 */
export const metadata: Metadata = {
  title: "Search",
  // Google's standing guidance for site-search result pages is noindex, follow.
  // Indexing them fills the corpus with near-duplicate and zero-result pages
  // that compete with the real category and product URLs.
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
