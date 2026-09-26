"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

/** Routes where the Footer should NOT render. */
const HIDDEN_PREFIXES = [
  "/admin",
  "/account",
  "/login",
  "/register",
  "/forgot-password",
  "/checkout",
];

function isHidden(pathname: string): boolean {
  return HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function StorefrontFooter() {
  const pathname = usePathname();
  if (isHidden(pathname)) return null;
  return <Footer />;
}
