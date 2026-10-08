import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/structured-data";

type ProductStructuredDataProps = {
  name: string;
  description: string;
  image?: string;
  sku?: string;
  brand: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  reviewCount?: number;
  url: string;
};

export default function ProductStructuredData({
  name,
  description,
  image,
  sku,
  brand,
  price,
  currency = "GHS",
  availability = "InStock",
  ratingValue,
  reviewCount,
  url,
}: ProductStructuredDataProps) {
  const jsonLd = generateProductJsonLd({
    name,
    description,
    image,
    sku,
    brand,
    price,
    currency,
    availability,
    ratingValue,
    reviewCount,
    url,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type BreadcrumbStructuredDataProps = {
  items: Array<{ name: string; url: string }>;
};

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const jsonLd = generateBreadcrumbJsonLd(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
