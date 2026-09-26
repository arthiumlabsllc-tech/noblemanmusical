"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { MobileTabBar } from "./mobile-tab-bar";

/** Routes where the storefront Navbar + TabBar should NOT render. */
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

export function RouteChrome() {
  const pathname = usePathname();

  if (isHidden(pathname)) return null;

  return (
    <>
      <Navbar />
      <MobileTabBar />
    </>
  );
}
