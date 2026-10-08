// JSON-LD structured data generators for SEO

type ProductStructuredData = {
  name: string;
  description: string;
  image?: string;
  sku?: string;
  brand: string;
  price: number;
  currency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  reviewCount?: number;
  url: string;
};

export function generateProductJsonLd(product: ProductStructuredData) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        "@type": "Organization",
        name: "Nobleman Musical Center",
      },
    },
    aggregateRating: product.ratingValue
      ? {
          "@type": "AggregateRating",
          ratingValue: product.ratingValue,
          reviewCount: product.reviewCount,
        }
      : undefined,
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nobleman Musical Center",
    url: "https://noblemanmusic.com",
    logo: "https://noblemanmusic.com/logo.png",
    description:
      "Ghana's premier destination for premium musical instruments. Authorized dealer for Fender, Yamaha, Gibson, Shure, and more.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Independence Avenue",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+233-24-123-4567",
      contactType: "customer service",
      email: "support@noblemanmusic.com",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.facebook.com/noblemanmusic",
      "https://www.instagram.com/noblemanmusic",
      "https://www.twitter.com/noblemanmusic",
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nobleman Musical Center",
    url: "https://noblemanmusic.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://noblemanmusic.com/shop?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://noblemanmusic.com${item.url}`,
    })),
  };
}
