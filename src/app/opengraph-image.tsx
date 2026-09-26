import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nobleman Musical Center — Premium Musical Instruments in Ghana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function handler() {
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
        {/* Decorative gold border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "2px solid rgba(201, 168, 76, 0.3)",
            borderRadius: "12px",
          }}
        />

        {/* Gold accent line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#C9A84C",
            marginBottom: "32px",
          }}
        />

        {/* Crown / N monogram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "2px solid #C9A84C",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#C9A84C",
              fontFamily: "serif",
            }}
          >
            N
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#FDF8F0",
            textAlign: "center",
            marginBottom: "12px",
            fontFamily: "serif",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Nobleman Musical Center
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "22px",
            color: "rgba(253, 248, 240, 0.7)",
            textAlign: "center",
            maxWidth: "700px",
            marginBottom: "32px",
            fontFamily: "sans-serif",
            lineHeight: 1.4,
          }}
        >
          Ghana&apos;s Premier Destination for Premium Musical Instruments
        </p>

        {/* Category pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Guitars", "Keyboards", "Drums", "PA Systems", "Traditional"].map(
            (cat) => (
              <span
                key={cat}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(201, 168, 76, 0.4)",
                  color: "#C9A84C",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                  fontWeight: 500,
                }}
              >
                {cat}
              </span>
            )
          )}
        </div>

        {/* Bottom gold line */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            width: "120px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          }}
        />

        {/* URL */}
        <span
          style={{
            position: "absolute",
            bottom: "50px",
            fontSize: "14px",
            color: "rgba(253, 248, 240, 0.4)",
            fontFamily: "sans-serif",
          }}
        >
          noblemanmusical.com
        </span>
      </div>
    ),
    { ...size }
  );
}
