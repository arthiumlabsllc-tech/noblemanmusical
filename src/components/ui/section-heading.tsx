import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  /** Small brush-script word that overlaps the caps (e.g. "New", "Gear", "Shop") */
  script?: string;
  /** The main tracked-out uppercase word(s) (e.g. "INSTRUMENTS") */
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  script,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {script ? (
        <>
          <span
            className={cn(
              "section-script text-6xl sm:text-7xl",
              align === "center" ? "mx-auto -mb-2 sm:-mb-4" : "-ml-3 -mb-2 sm:-mb-4",
            )}
          >
            {script}
          </span>
          <h2 className="section-caps text-lg sm:text-xl">{title}</h2>
        </>
      ) : (
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      )}
      {subtitle && (
        <p className="mt-4 text-sm text-body sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}
