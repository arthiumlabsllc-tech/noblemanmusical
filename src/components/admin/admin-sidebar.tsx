"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Warehouse,
  FileText,
  Tag,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/discounts", label: "Discounts", icon: Tag },
];

interface AdminSidebarProps {
  /** "desktop" = white bg for sidebar column; "drawer" = navy bg for mobile overlay */
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
}

export function AdminSidebar({ variant = "desktop", onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const isDrawer = variant === "drawer";

  return (
    <nav className={cn(
      "flex flex-col px-3 py-4",
      isDrawer ? "h-full" : "sticky top-16 flex h-[calc(100vh-4rem)]",
    )}>
      {isDrawer && (
        <div className="border-b border-cream/10 px-3 pb-4 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/60">Navigation</p>
        </div>
      )}
      <ul className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
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

      {/* Footer */}
      <div className={cn(
        "border-t px-3 py-4",
        isDrawer ? "border-cream/10" : "border-cream-dark"
      )}>
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isDrawer
              ? "text-cream/70 hover:bg-cream/5 hover:text-gold"
              : "text-charcoal/70 hover:bg-cream/50 hover:text-navy-deep"
          )}
        >
          <LogOut className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </nav>
  );
}
