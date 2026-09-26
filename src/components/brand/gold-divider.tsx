import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  width?: number;
}

/** A decorative gold horizontal divider line */
export function GoldDivider({ className, width = 80 }: GoldDividerProps) {
  return (
    <div
      className={cn("mx-auto h-px bg-gradient-to-r from-transparent via-gold to-transparent", className)}
      style={{ width }}
    />
  );
}
