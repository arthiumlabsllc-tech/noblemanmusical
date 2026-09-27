/**
 * Google Analytics 4 (gtag.js) integration.
 *
 * Why not the raw snippet from the GA console?
 * 1. It only fires `page_view` on a full document load. This is an App Router
 *    SPA, so client-side navigations would be invisible — every visit would
 *    look like a one-page bounce. We send `page_view` on `usePathname()` change
 *    instead and turn off the built-in one with `send_page_view: false`, which
 *    also avoids double-counting the first load.
 * 2. `<script>` in `app/layout.tsx` is not deferred or optimised; `next/script`
 *    dedupes the tag across the tree and applies the chosen loading strategy.
 * 3. A literal ID baked into JSX cannot be rotated per environment. It comes
 *    from NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, validated against the gtag ID shape
 *    before being interpolated into executable script text.
 *
 * Consent: the tag starts with storage denied (Google Consent Mode v2) and is
 * only lifted for visitors who accepted via <CookieConsent />.
 */

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Shared with <CookieConsent /> — must stay in sync with that component. */
export const CONSENT_KEY = "nmc-analytics-consent";

/** GA4 measurement IDs look like G-XXXXXXXXXX; AW-… and GT-… also occur. */
const GA_ID = (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "").trim();
const GA_ID_PATTERN = /^(G|AW|GT)-[A-Z0-9]{4,}$/;

/** Blank/invalid config means analytics is simply not installed in this env. */
const gaId = GA_ID_PATTERN.test(GA_ID) ? GA_ID : "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Lift or revoke storage for an already-loaded tag.
 * Called by <CookieConsent /> so accepting works without a page reload.
 */
export function applyAnalyticsConsent(granted: boolean) {
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
  });
}

function bootstrap(id: string): string {
  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag = gtag;",
    // Deny by default, then upgrade only if this visitor already accepted.
    "gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',functionality_storage:'denied',personalization_storage:'denied'});",
    "try{if(localStorage.getItem('" +
      CONSENT_KEY +
      "')==='accepted'){gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted'});}}catch(e){}",
    "gtag('js', new Date());",
    // page_view is emitted by the effect below, never by the tag itself.
    "gtag('config','" + id + "',{send_page_view:false});",
  ].join("");
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId) return;
    // `gtag` is assigned by the bootstrap script. If extensions or a network
    // failure prevented it, the optional call is a no-op — analytics must
    // never be able to break navigation.
    //
    // window.location is read rather than useSearchParams(): the latter would
    // make the root layout bail out of static rendering for every page.
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }, [pathname]);

  if (!gaId) return null;

  return (
    <>
      <Script id="ga4-bootstrap" strategy="afterInteractive">
        {bootstrap(gaId)}
      </Script>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      />
    </>
  );
}
