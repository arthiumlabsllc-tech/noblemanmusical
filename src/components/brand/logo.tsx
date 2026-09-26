import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoVariant = "full" | "horizontal" | "icon";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  tone?: "gold" | "cream" | "navy";
  width?: number;
  useImage?: boolean;
}

const toneMap = {
  gold:  { primary: "#D4AF37", secondary: "#F5F0E6", accent: "#E8C766" },
  cream: { primary: "#F5F0E6", secondary: "#F5F0E6", accent: "#E8C766" },
  navy:  { primary: "#0B1B3B", secondary: "#0B1B3B", accent: "#D4AF37" },
};

export function Logo({ variant = "full", className, tone = "gold", width, useImage = false }: LogoProps) {
  const c = toneMap[tone];
  const containerStyle = width ? { width, height: "auto" } : undefined;

  // Use image logo when specified
  if (useImage) {
    return (
      <div className={cn("inline-flex", className)} style={containerStyle}>
        <Image
          src="/logos/header-logo.png"
          alt="Nobleman Musical Center"
          width={width ?? 160}
          height={0}
          style={{ height: "auto" }}
          priority
        />
      </div>
    );
  }

  const Icon = (
    <svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg" aria-label="Nobleman Musical Center" role="img" style={{ width: variant === "icon" ? 48 : 260, height: "auto" }}>
      <g fill={c.primary}>
        <rect x="55"  y="50" width="10" height="40" rx="2"/>
        <rect x="72"  y="32" width="10" height="58" rx="2"/>
        <rect x="89"  y="12" width="10" height="78" rx="2"/>
        <rect x="106" y="0"  width="10" height="90" rx="2"/>
        <rect x="123" y="-8" width="10" height="98" rx="2" fill={c.accent}/>
        <rect x="140" y="0"  width="10" height="90" rx="2"/>
        <rect x="157" y="12" width="10" height="78" rx="2"/>
        <rect x="174" y="32" width="10" height="58" rx="2"/>
        <rect x="191" y="50" width="10" height="40" rx="2"/>
        <rect x="50" y="96" width="156" height="5"/>
        <g opacity="0.35">
          <rect x="72"  y="110" width="10" height="18" rx="2"/>
          <rect x="106" y="110" width="10" height="26" rx="2"/>
          <rect x="140" y="110" width="10" height="26" rx="2"/>
          <rect x="174" y="110" width="10" height="18" rx="2"/>
        </g>
      </g>
    </svg>
  );

  if (variant === "icon") return <div className={cn("inline-flex", className)} style={containerStyle}>{Icon}</div>;

  if (variant === "horizontal") {
    return (
      <div className={cn("inline-flex items-center gap-3", className)} style={containerStyle}>
        <div style={{ flexShrink: 0 }}>
          <svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg" aria-label="Nobleman Musical Center" role="img" style={{ width: 48, height: "auto" }}>
            <g fill={c.primary}>
              <rect x="55"  y="50" width="10" height="40" rx="2"/>
              <rect x="72"  y="32" width="10" height="58" rx="2"/>
              <rect x="89"  y="12" width="10" height="78" rx="2"/>
              <rect x="106" y="0"  width="10" height="90" rx="2"/>
              <rect x="123" y="-8" width="10" height="98" rx="2" fill={c.accent}/>
              <rect x="140" y="0"  width="10" height="90" rx="2"/>
              <rect x="157" y="12" width="10" height="78" rx="2"/>
              <rect x="174" y="32" width="10" height="58" rx="2"/>
              <rect x="191" y="50" width="10" height="40" rx="2"/>
              <rect x="50" y="96" width="156" height="5"/>
              <g opacity="0.35">
                <rect x="72"  y="110" width="10" height="18" rx="2"/>
                <rect x="106" y="110" width="10" height="26" rx="2"/>
                <rect x="140" y="110" width="10" height="26" rx="2"/>
                <rect x="174" y="110" width="10" height="18" rx="2"/>
              </g>
            </g>
          </svg>
        </div>
        <div className="flex flex-col">
          <div style={{ color: c.primary, fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: 18, letterSpacing: 4 }}>
            NOBLEMAN
          </div>
          <div style={{ color: c.secondary, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: 6, textTransform: "uppercase", opacity: 0.85 }}>
            Musical Center
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)} style={containerStyle}>
      {Icon}
      <div style={{ color: c.primary, fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: 22, letterSpacing: 6 }}>
        NOBLEMAN
      </div>
      <div style={{ color: c.secondary, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: 8, textTransform: "uppercase", opacity: 0.85 }}>
        Musical Center
      </div>
      {variant === "full" && (
        <>
          <div style={{ height: 1, width: 100, background: c.primary, margin: "4px 0" }} />
          <div style={{ color: c.accent, fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 13, letterSpacing: 2 }}>
            Where Music Meets Majesty
          </div>
        </>
      )}
    </div>
  );
}
