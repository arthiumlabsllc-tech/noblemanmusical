import { cn } from "@/lib/utils/cn";

type LogoVariant = "full" | "horizontal" | "icon";
interface LogoProps {
  variant?: LogoVariant;
  tone?: "gold" | "cream" | "navy";
  width?: number;
  className?: string;
}

const toneMap = {
  gold: { primary: "#bb976d", secondary: "#f6f6f6", accent: "#c9ab84" },
  cream: { primary: "#f6f6f6", secondary: "#f6f6f6", accent: "#bb976d" },
  navy: { primary: "#172430", secondary: "#bb976d", accent: "#bb976d" },
};

export function Logo({ variant = "full", tone = "gold", width = 180, className }: LogoProps) {
  const c = toneMap[tone];

  const Icon = (
    <svg
      viewBox="40 -10 170 115"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nobleman Musical Center"
      role="img"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <g fill={c.primary}>
        <rect x="55" y="50" width="10" height="40" rx="2" />
        <rect x="72" y="32" width="10" height="58" rx="2" />
        <rect x="89" y="12" width="10" height="78" rx="2" />
        <rect x="106" y="0" width="10" height="90" rx="2" />
        <rect x="123" y="-8" width="10" height="98" rx="2" fill={c.accent} />
        <rect x="140" y="0" width="10" height="90" rx="2" />
        <rect x="157" y="12" width="10" height="78" rx="2" />
        <rect x="174" y="32" width="10" height="58" rx="2" />
        <rect x="191" y="50" width="10" height="40" rx="2" />
        <rect x="50" y="96" width="156" height="5" />
      </g>
    </svg>
  );

  // Icon-only variant
  if (variant === "icon")
    return (
      <div className={cn("inline-flex", className)} style={{ width: 48 }}>
        {Icon}
      </div>
    );

  // Horizontal variant — icon + text side by side (for header)
  if (variant === "horizontal") {
    const iconWidth = Math.round(width * 0.42);
    const textFontSize = Math.max(12, Math.round(width * 0.14));
    const subFontSize = Math.max(7, Math.round(width * 0.065));
    return (
      <div
        className={cn("inline-flex items-center gap-2", className)}
        style={{ width: "auto" }}
      >
        <div style={{ width: iconWidth, flexShrink: 0 }}>{Icon}</div>
        <div className="flex flex-col whitespace-nowrap leading-tight">
          <span
            style={{
              color: c.primary,
              fontFamily: "var(--font-josefin), sans-serif",
              fontWeight: 700,
              fontSize: textFontSize,
              letterSpacing: Math.max(2, textFontSize * 0.28),
            }}
          >
            NOBLEMAN
          </span>
          <span
            style={{
              color: c.secondary,
              fontFamily: "var(--font-josefin), sans-serif",
              fontWeight: 500,
              fontSize: subFontSize,
              letterSpacing: Math.max(2, subFontSize * 0.8),
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Musical Center
          </span>
        </div>
      </div>
    );
  }

  // Full variant — stacked with tagline (for footer, about page, etc.)
  return (
    <div className={cn("inline-flex flex-col items-center", className)} style={{ width }}>
      {Icon}
      <div
        style={{
          color: c.primary,
          fontFamily: "var(--font-josefin), sans-serif",
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 6,
          lineHeight: 1.2,
          marginTop: 2,
        }}
      >
        NOBLEMAN
      </div>
      <div
        style={{
          color: c.secondary,
          fontFamily: "var(--font-josefin), sans-serif",
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: 0.85,
          lineHeight: 1.2,
        }}
      >
        Musical Center
      </div>
      <div
        style={{
          height: 1,
          width: 100,
          background: c.primary,
          margin: "4px 0",
        }}
      />
      <div
        style={{
          color: c.accent,
          fontFamily: "var(--font-yellowtail), cursive",
          fontStyle: "normal",
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        Where Music Meets Majesty
      </div>
    </div>
  );
}
