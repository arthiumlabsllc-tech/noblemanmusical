import type { Metadata } from "next";

/**
 * Server layout supplying metadata for the client-only offline fallback page.
 * See the note in ../search/layout.tsx for why this has to be a separate file.
 */
export const metadata: Metadata = {
  title: "Offline",
  // A service-worker fallback with no content of its own. Indexing it would
  // only add an empty page that competes with the real storefront.
  robots: { index: false, follow: false },
};

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
