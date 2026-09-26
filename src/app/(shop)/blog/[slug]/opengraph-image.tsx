import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/content/blog";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Blog Post";
  const author = post?.author ?? "";
  const category = post?.category ?? "";
  const readTime = post?.readTime ?? "";

  // Truncate title if too long
  const displayTitle =
    title.length > 60 ? title.slice(0, 57) + "..." : title;

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

        {/* Blog badge */}
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
            marginBottom: "24px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Nobleman Blog
        </span>

        {/* Category */}
        {category && (
          <span
            style={{
              fontSize: "14px",
              color: "rgba(201, 168, 76, 0.7)",
              fontFamily: "sans-serif",
              fontWeight: 500,
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {category}
          </span>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 700,
            color: "#FDF8F0",
            textAlign: "center",
            maxWidth: "900px",
            marginBottom: "24px",
            fontFamily: "serif",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {displayTitle}
        </h1>

        {/* Gold divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background: "#C9A84C",
            marginBottom: "20px",
          }}
        />

        {/* Author + read time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {author && (
            <span
              style={{
                fontSize: "15px",
                color: "rgba(253, 248, 240, 0.6)",
                fontFamily: "sans-serif",
              }}
            >
              {author}
            </span>
          )}
          {author && readTime && (
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(253, 248, 240, 0.3)",
              }}
            />
          )}
          {readTime && (
            <span
              style={{
                fontSize: "14px",
                color: "rgba(253, 248, 240, 0.4)",
                fontFamily: "sans-serif",
              }}
            >
              {readTime}
            </span>
          )}
        </div>

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
