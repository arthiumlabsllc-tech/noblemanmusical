/**
 * JSON-LD structured-data builders.
 *
 * Pure functions returning schema.org objects — no React, no side effects, so
 * they can be unit-tested and reused by any route. Rendering happens through
 * `<JsonLd>` in `@/components/seo/json-ld`.
 *
 * Rules followed deliberately:
 * - Never invent values. Optional fields are omitted rather than guessed, since
 *   fabricated ratings/GTINs/opening hours are manual-actions risk on Google.
 * - Prices are converted from pesewas to decimal cedi at the boundary.
 * - `@id` values are stable so entities merge instead of duplicating.
 */

import { SITE, SITE_URL, SEARCH_PATH, absoluteUrl, pesewasToDecimal } from "./config";
import type { SeedProduct, SeedCategory } from "@/lib/data/products";
import type { BlogPost } from "@/lib/content/blog";

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;

/** A postal address object shared by the local-business and contact pages. */
function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  };
}

/**
 * `MusicStore` is the schema.org subtype for a musical-instrument retailer. It
 * inherits from LocalBusiness, so it earns the knowledge-panel / map-listing
 * treatment while staying more specific than a bare `Organization`.
 */
export function musicStoreLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.name,
    description: SITE.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logos/header-logo.png"),
    image: absoluteUrl("/logos/footer-logo.png"),
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    priceRange: "$$",
    currenciesAccepted: SITE.currency,
    paymentAccepted: "Mobile Money (MTN, Telecel, AirtelTigo), Card, Cash",
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: SITE.mapsUrl,
    areaServed: { "@type": "Country", name: SITE.address.countryName },
    // ContactPage gives the crawlable path to the phone/address pair.
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.contact.phone,
      contactType: "customer service",
      availableLanguage: ["en", "tw"],
    },
    ...(SITE.sameAs.length > 0 ? { sameAs: SITE.sameAs } : {}),
  };
}

/**
 * `WebSite` + `SearchAction` is what makes a sitelinks search box possible.
 * The template syntax (`{search_term_string}`) is literal — Google expands it.
 */
export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: absoluteUrl("/"),
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(SEARCH_PATH)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Store-wide breadcrumb root, reused by every nested builder. */
function breadcrumbItems(
  trail: { name: string; path: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      // The final crumb is the current page, so Google wants no URL there.
      ...(i < trail.length - 1 ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function breadcrumbLd(
  trail: { name: string; path: string }[]
): JsonLd {
  return breadcrumbItems([{ name: "Home", path: "/" }, ...trail]);
}

/**
 * Product rich result: price, availability and rating are the three fields
 * Google actually surfaces, so each is guarded against missing/zero data.
 */
export function productLd(product: SeedProduct): JsonLd {
  const onStock = product.stock > 0;

  const offers: JsonLd = {
    "@type": "Offer",
    url: absoluteUrl(`/product/${product.slug}`),
    priceCurrency: SITE.currency,
    price: pesewasToDecimal(product.price),
    availability: onStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": ORG_ID },
    priceValidUntil: priceValidUntil(),
  };

  // `compareAtPrice` is intentionally NOT emitted. Google's product rich result
  // only defines `price`; a struck-through "was" price has no supported
  // property, and inventing one (e.g. priceOldPrice) draws structured-data
  // warnings without earning any display.

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    productID: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    category: product.categoryName,
    url: absoluteUrl(`/product/${product.slug}`),
    image: product.images.length > 0 ? product.images.map(absoluteUrl) : [SITE.logo],
    offers,
    ...(product.reviewCount > 0 && product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/** Google asks for a date 90+ days out; use the end of next year. */
function priceValidUntil(): string {
  const year = new Date().getFullYear() + 1;
  return `${year}-12-31`;
}

/** Collection page for a category, with its product list. */
export function collectionPageLd(
  category: SeedCategory,
  categoryProducts: SeedProduct[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} — ${SITE.name}`,
    description: category.description,
    url: absoluteUrl(`/shop/${category.slug}`),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map((product, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/product/${product.slug}`),
        name: product.name,
      })),
    },
  };
}

/**
 * BlogPosting. `image` must be an absolute, publicly reachable URL, which is
 * why the seed data now carries real CDN URLs instead of missing local files.
 */
export function blogPostingLd(post: BlogPost): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.image)],
    inLanguage: "en",
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": ORG_ID },
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    url: absoluteUrl(`/blog/${post.slug}`),
    ...(post.readTime
      ? { timeRequired: post.readTime.replace("min read", "MT") }
      : {}),
  };
}

/** Fallback entity graph for pages with no specific type. */
export function webpageLd(opts: {
  name: string;
  description?: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}
