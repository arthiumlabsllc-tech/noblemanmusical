"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, Heart, MapPin, Settings, User } from "lucide-react";

const navItems = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

interface AccountSidebarProps {
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
}

export function AccountSidebar({ variant = "desktop", onNavigate }: AccountSidebarProps) {
  const pathname = usePathname();
  const isDrawer = variant === "drawer";

  return (
    <nav className={cn(
      "flex flex-col px-3 py-4",
      isDrawer ? "h-full" : "sticky top-16 flex h-[calc(100vh-4rem)]",
    )}>
      {isDrawer && (
        <div className="border-b border-cream/10 px-3 pb-4 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/60">My Account</p>
        </div>
      )}
      <ul className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? isDrawer ? "bg-gold/15 text-gold" : "bg-navy-deep text-cream"
                    : isDrawer
                      ? "text-cream/70 hover:bg-cream/5 hover:text-gold"
                      : "text-charcoal/70 hover:bg-cream/50 hover:text-navy-deep"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
