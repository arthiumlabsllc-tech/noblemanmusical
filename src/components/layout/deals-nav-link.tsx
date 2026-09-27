"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Tag } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import { DEALS_HREF } from "@/lib/data/shop-links";

/* The href moved to `@/lib/data/shop-links` in item 4 so the footer can point at
   the identical filter. Re-exported here because this module is still the place
   readers look for the Deals link. */
export { DEALS_HREF };

/**
 * Deals is the only nav item whose active state lives in the query string, and
 * `usePathname()` never reports that.
 *
 * This matters more than it looks: the "On sale only" chip on the shop page
 * calls `router.push("/shop")` — a query-only navigation with an unchanged
 * pathname. Any optimistic or event-listener-based state would keep the
 * underline lit after the shopper cleared the very filter it advertises.
 * `useSearchParams()` is the only source that updates for that transition.
 */
function useDealsActive(): boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return pathname === "/shop" && searchParams.get("deals") === "true";
}

function ShopDealsMarkup({
  shopActive,
  dealsActive,
}: {
  shopActive: boolean;
  dealsActive: boolean;
}) {
  return (
    <>
      <NavLink href={DEALS_HREF} active={dealsActive} tone="gold" icon={Tag}>
        Deals
      </NavLink>
      {/* Both links describe the same route, so the more specific one wins:
          underlining Shop *and* Deals reads as a rendering glitch. */}
      <NavLink href="/shop" active={shopActive && !dealsActive}>
        Shop
      </NavLink>
    </>
  );
}

function LiveShopDealsLinks({ shopActive }: { shopActive: boolean }) {
  const dealsActive = useDealsActive();
  return <ShopDealsMarkup shopActive={shopActive} dealsActive={dealsActive} />;
}

/**
 * Deals + Shop as one unit.
 *
 * Shop is inside the boundary only because it needs to know whether Deals is
 * active; splitting them across the boundary would underline both at once.
 *
 * The Suspense fallback is deliberately the *same two links with the underline
 * off* rather than `null`. A `null` fallback would drop both anchors out of the
 * statically prerendered HTML on every page — two lost internal links on a site
 * whose Phase 23 goal is SEO. Hydration only swaps in the underline.
 */
export function ShopNavLinks({ shopActive }: { shopActive: boolean }) {
  return (
    <Suspense
      fallback={<ShopDealsMarkup shopActive={shopActive} dealsActive={false} />}
    >
      <LiveShopDealsLinks shopActive={shopActive} />
    </Suspense>
  );
}

/**
 * The drawer copy. The drawer is closed during prerendering, so nothing here
 * reaches the static HTML either way — but it is still wrapped for consistency
 * with the desktop row and to keep the active rule in a single place.
 */
export function DrawerDealsLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<DrawerDealsMarkup active={false} onNavigate={onNavigate} />}>
      <LiveDrawerDealsLink onNavigate={onNavigate} />
    </Suspense>
  );
}

function DrawerDealsMarkup({
  active,
  onNavigate,
}: {
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={DEALS_HREF}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className="block rounded-lg px-4 py-4 text-lg font-medium text-gold transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
    >
      Deals
    </Link>
  );
}

function LiveDrawerDealsLink({ onNavigate }: { onNavigate?: () => void }) {
  return <DrawerDealsMarkup active={useDealsActive()} onNavigate={onNavigate} />;
}
