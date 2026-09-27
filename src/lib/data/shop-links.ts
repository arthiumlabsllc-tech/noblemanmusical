/**
 * Canonical storefront filter URLs.
 *
 * These live in `lib/data` rather than beside the components that render them so
 * that navigation, footer and any future merchandising surface can point at the
 * SAME query string. `shop-content.tsx` is the consumer that gives these meaning:
 * an href that its parser does not honour would render a filter chip that does
 * nothing, which is worse than not linking at all.
 */

/** On-sale catalogue. Honoured by `ShopContent` via `?deals=true`. */
export const DEALS_HREF = "/shop?deals=true";

/**
 * Newest-first catalogue.
 *
 * `?sort=newest` is a real ordering in `ShopContent`'s sort switch (seed order is
 * newest-first), not a marketing label — which is why this link exists at all.
 */
export const NEW_ARRIVALS_HREF = "/shop?sort=newest";

/** A department landing page. */
export function departmentHref(slug: string): string {
  return `/shop/${slug}`;
}
