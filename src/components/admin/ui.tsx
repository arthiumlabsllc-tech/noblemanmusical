import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/cn";

/* ── Flash banner (reads ?msg / ?error from a redirect) ───────────────── */

const MSG: Record<string, string> = {
  updated: "Stock updated for this store.",
  created: "Discount created.",
  toggled: "Discount status changed.",
  registered: "Employee registered — they can sign in now.",
  sale: "Sale recorded.",
  db: "Database not configured — connect DATABASE_URL to save changes.",
  invalid: "Please check the form and try again.",
  exists: "That discount code already exists.",
  dupe: "A user with that email already exists.",
  pct: "Percentage discounts must be 100 or less.",
  notfound: "Item not found.",
  failed: "Something went wrong. Please try again.",
};

export function Flash({ msg, error }: { msg?: string; error?: string }) {
  const text = (msg && MSG[msg]) || (error && MSG[error]);
  if (!text) return null;
  const bad = Boolean(error);
  return (
    <div
      className={cn(
        "mb-6 border px-4 py-3 text-sm",
        bad
          ? "border-kente-red/40 bg-kente-red/5 text-kente-red"
          : "border-kente-green/40 bg-kente-green/5 text-kente-green"
      )}
    >
      {text}
    </div>
  );
}

/* ── Page + section scaffolding ───────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("border border-line bg-white", className)}>{children}</section>;
}

export function CardHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-6 py-4">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      {right}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-line bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-kente-green">{hint}</p>}
    </div>
  );
}

/* ── Form controls ────────────────────────────────────────────────────── */

const inputBase =
  "h-11 w-full border border-line bg-white px-3 text-sm text-body outline-none transition-colors focus:border-gold";

export function Field({
  label,
  hint,
  className,
  ...rest
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      <input className={inputBase} {...rest} />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...rest
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      <select className={cn(inputBase, "cursor-pointer")} {...rest}>
        {children}
      </select>
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...rest
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
      <textarea className="min-h-[96px] w-full border border-line bg-white px-3 py-2 text-sm text-body outline-none focus:border-gold" {...rest} />
    </label>
  );
}

/* ── Buttons (navy wipe / gold wipe, square) ──────────────────────────── */

export function PrimaryButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center border border-navy bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-navy disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function GoldButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center border border-gold bg-gold px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy hover:border-navy disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ── Badge ────────────────────────────────────────────────────────────── */

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "gold" | "red" }) {
  const tones: Record<string, string> = {
    neutral: "border-line text-muted",
    green: "border-kente-green/40 text-kente-green",
    gold: "border-gold/40 text-gold",
    red: "border-kente-red/40 text-kente-red",
  };
  return (
    <span className={cn("inline-block border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}
