/**
 * `<JsonLd>` — renders schema.org data as an `application/ld+json` script tag.
 *
 * Deliberately has no `"use client"` directive: it is plain markup with no
 * interactivity, so it must not become a client component. Crawlers and Next's
 * prerender both need the JSON present in the initial HTML.
 */

import { musicStoreLd, websiteLd } from "@/lib/seo/json-ld";
import type { JsonLd as JsonLdData } from "@/lib/seo/json-ld";

/**
 * Escape so the JSON cannot terminate its own <script> element.
 *
 * `JSON.stringify` alone is unsafe here: a value containing `</script>` would
 * close the tag early and let the remainder be parsed as HTML. Escaping `<`,
 * `>` and `&` to unicode escapes keeps the payload *semantically* identical for
 * a JSON parser while removing every character sequence that could open or
 * close a tag — so `dangerouslySetInnerHTML` below only ever receives output
 * that cannot contain live markup.
 *
 * U+2028/U+2029 need no handling: they are legal inside JSON strings, and the
 * content of this element is read by a JSON parser, never evaluated as JS.
 */
function serialize(data: JsonLdData | JsonLdData[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

/**
 * The entity graph every page should carry: the business plus the WebSite /
 * SearchAction. Rendered once in the root layout so product, category and blog
 * pages can reference the same `@id`s instead of redefining the publisher.
 */
export function SiteJsonLd() {
  return <JsonLd data={[musicStoreLd(), websiteLd()]} />;
}
