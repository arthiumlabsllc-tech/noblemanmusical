import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/data/products";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  const name = product?.name ?? "Product";
  const brand = product?.brand ?? "";
  const price = product
    ? `GH₵${(product.price / 100).toFixed(2)}`
    : "";
  const category = product?.categoryName ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #060F24 0%, #0A1A3A 60%, #060F24 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left panel — product info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 50px",
          }}
        >
          {/* Category badge */}
          {category && (
            <span
              style={{
                display: "inline-flex",
                padding: "6px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201, 168, 76, 0.5)",
                color: "#C9A84C",
                fontSize: "13px",
                fontFamily: "sans-serif",
                fontWeight: 500,
                marginBottom: "20px",
                width: "fit-content",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {category}
            </span>
          )}

          {/* Brand */}
          {brand && (
            <span
              style={{
                fontSize: "15px",
                color: "rgba(253, 248, 240, 0.5)",
                fontFamily: "sans-serif",
                fontWeight: 400,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {brand}
            </span>
          )}

          {/* Product name */}
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#FDF8F0",
              lineHeight: 1.15,
              marginBottom: "20px",
              fontFamily: "serif",
              letterSpacing: "-0.01em",
              maxWidth: "500px",
            }}
          >
            {name}
          </h1>

          {/* Price */}
          {price && (
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#C9A84C",
                fontFamily: "sans-serif",
              }}
            >
              {price}
            </span>
          )}

          {/* Bottom branding */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1.5px solid #C9A84C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
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
                fontSize: "13px",
                color: "rgba(253, 248, 240, 0.5)",
                fontFamily: "sans-serif",
              }}
            >
              Nobleman Musical Center
            </span>
          </div>
        </div>

        {/* Right panel — decorative */}
        <div
          style={{
            width: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Large decorative circle */}
          <div
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%)",
              border: "1px solid rgba(201, 168, 76, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, transparent 70%)",
                border: "1px solid rgba(201, 168, 76, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "rgba(201, 168, 76, 0.3)",
                  fontFamily: "serif",
                }}
              >
                N
              </span>
            </div>
          </div>

          {/* URL */}
          <span
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              fontSize: "12px",
              color: "rgba(253, 248, 240, 0.3)",
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
