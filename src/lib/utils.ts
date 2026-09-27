import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in Ghana Cedis (pesewas → display) */
export function formatGHS(amountInPesewas: number): string {
  const amount = amountInPesewas / 100;
  return `₵${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format price in USD */
export function formatUSD(amountInPesewas: number): string {
  const amount = amountInPesewas / 100;
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Convert pesewas to cedis */
export function pesewasToCedis(pesewas: number): number {
  return pesewas / 100;
}

/** Convert cedis to pesewas (integer) */
export function cedisToPesewas(cedis: number): number {
  return Math.round(cedis * 100);
}

/** Generate a URL-friendly slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a random order number */
export function generateOrderNumber(): string {
  const prefix = "NMC";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
