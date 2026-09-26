import { ImageResponse } from "next/og";
import { categories } from "@/lib/data/products";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);

  const name = cat?.name ?? category;
  const description = cat?.description ?? "";
  const count = cat?.productCount ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #060F24 0%, #0A1A3A 50%, #060F24 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "2px solid rgba(201, 168, 76, 0.2)",
            borderRadius: "12px",
          }}
        />

        {/* Shop label */}
        <span
          style={{
            display: "inline-flex",
            padding: "6px 18px",
            borderRadius: "999px",
            background: "rgba(201, 168, 76, 0.15)",
            color: "#C9A84C",
            fontSize: "13px",
            fontFamily: "sans-serif",
            fontWeight: 600,
            marginBottom: "28px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Shop
        </span>

        {/* Category name */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#FDF8F0",
            textAlign: "center",
            marginBottom: "16px",
            fontFamily: "serif",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: "20px",
              color: "rgba(253, 248, 240, 0.6)",
              textAlign: "center",
              maxWidth: "600px",
              marginBottom: "24px",
              fontFamily: "sans-serif",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        )}

        {/* Product count */}
        <span
          style={{
            fontSize: "16px",
            color: "#C9A84C",
            fontFamily: "sans-serif",
            fontWeight: 500,
          }}
        >
          {count} {count === 1 ? "Product" : "Products"} Available
        </span>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1.5px solid #C9A84C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: "#C9A84C",
                fontFamily: "serif",
              }}
            >
              N
            </span>
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "rgba(253, 248, 240, 0.4)",
              fontFamily: "sans-serif",
            }}
          >
            noblemanmusical.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
