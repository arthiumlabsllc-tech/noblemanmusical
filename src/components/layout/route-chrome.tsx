"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { MobileTabBar } from "./mobile-tab-bar";
import type { Department } from "@/lib/data/departments";
import type { MegaMenuFeature } from "@/lib/data/storefront-nav";

interface RouteChromeProps {
  /**
   * Computed once on the server by the root layout and handed down, so the
   * navbar never imports the product catalogue into the shared client bundle.
   */
  departments: Department[];
  feature: MegaMenuFeature | null;
}

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

export function RouteChrome({ departments, feature }: RouteChromeProps) {
  const pathname = usePathname();

  if (isHidden(pathname)) return null;

  return (
    <>
      <Navbar departments={departments} feature={feature} />
      <MobileTabBar />
    </>
  );
}
