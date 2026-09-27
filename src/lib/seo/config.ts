/**
 * SEO configuration — single source of truth for business identity.
 *
 * Everything here feeds structured data (JSON-LD), metadata, robots and the
 * sitemap. Keep it accurate: search engines surface these values directly in
 * rich results, so a wrong phone number or address becomes a permanent
 * listing error.
 *
 * Contact digits are *not* defined here — they come from `@/lib/config`, so the
 * number behind a `wa.me` link and the number in the JSON-LD can never drift
 * apart.
 */

import { PHONE_DISPLAY, WHATSAPP_NUMBER } from "@/lib/config";

/** Canonical origin, with any trailing slash removed. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://noblemanmusical.com"
).replace(/\/+$/, "");

export const SITE = {
  name: "Nobleman Musical Center",
  shortName: "Nobleman",
  tagline: "Where Music Meets Majesty",
  description:
    "Ghana's premier destination for premium musical instruments. Trusted by churches, radio stations, schools, and professional musicians. Guitars, keyboards, drums, PA systems, and traditional Ghanaian instruments.",

  url: SITE_URL,

  /** ISO-4217. All stored prices are in pesewas; convert before emitting. */
  currency: "GHS",
  locale: "en_GH",

  contact: {
    phone: PHONE_DISPLAY,
    /** Digits only — used to build wa.me links. */
    whatsapp: WHATSAPP_NUMBER,
    email: "info@noblemanmusical.com",
  },

  address: {
    street: "Zongo Lane",
    city: "Accra",
    region: "Greater Accra",
    country: "GH",
    countryName: "Ghana",
  },

  /**
   * Google Maps *search* link rather than a `/place/...` URL. A place URL needs
   * a real place ID, and guessing one would point the listing at the wrong
   * building. Searching the address text always resolves to something correct.
   */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Nobleman Musical Center, Zongo Lane, Accra, Ghana"),

  logo: `${SITE_URL}/logos/header-logo.png`,

  /**
   * Social profile URLs, used for the `sameAs` entity-disambiguation signal.
   * Empty until real profile URLs are known — an empty array is simply omitted
   * from the JSON-LD rather than emitted as a broken reference.
   */
  sameAs: [] as string[],

  /**
   * Approximate geolocation of central Accra. Deliberately coarse: precise
   * coordinates would pin the business in the wrong place until the showroom's
   * real GPS fix is supplied via NEXT_PUBLIC_BUSINESS_LAT/LNG.
   */
  geo: {
    lat: Number(process.env.NEXT_PUBLIC_BUSINESS_LAT ?? 5.55),
    lng: Number(process.env.NEXT_PUBLIC_BUSINESS_LNG ?? -0.2),
  },
} as const;

/** URL-safe search endpoint used by the WebSite SearchAction. */
export const SEARCH_PATH = "/search";

/**
 * Social profiles for the footer (§5.1).
 *
 * THE HANDLES ARE UNVERIFIED. No profile URLs have been supplied for this
 * business, so every entry is derived from ONE handle and marked for
 * confirmation — correcting it is a one-line change rather than a hunt through
 * components, and `audit.mjs refs noblemanmusical` finds every surface it
 * touches.
 *
 * Deliberately NOT folded into `sameAs` above: `sameAs` is an entity assertion
 * that search engines cache and use to decide which accounts belong to this
 * business. Pointing it at somebody else's Instagram is the kind of error that
 * outlives the deploy that introduced it, so it waits for confirmation.
 */
const SOCIAL_HANDLE = "noblemanmusical";

export interface SocialProfile {
  network: string;
  href: string;
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  { network: "Instagram", href: `https://www.instagram.com/${SOCIAL_HANDLE}/` },
  { network: "Facebook", href: `https://www.facebook.com/${SOCIAL_HANDLE}/` },
  { network: "YouTube", href: `https://www.youtube.com/@${SOCIAL_HANDLE}` },
  {
    // The only one of the four that is certainly correct today: it is built
    // from the same configured number as every other WhatsApp link in the app.
    network: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
];

/** Turn a site-relative path into an absolute URL. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Pesewas → decimal cedi, as a fixed string suitable for JSON-LD `price`. */
export function pesewasToDecimal(amountInPesewas: number): string {
  return (amountInPesewas / 100).toFixed(2);
}
