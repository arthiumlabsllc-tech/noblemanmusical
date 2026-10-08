import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { StoreSwitcher } from "@/components/admin/store-switcher";

export const metadata: Metadata = {
  title: "POS Terminal",
  description: "Point of Sale terminal for Nobleman Musical Center retail stores.",
};

const MANAGER_ROLES = ["super_admin", "admin", "manager"];

export default async function POSLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/pos");
  }

  const userRole = session.user.role;
  const posRoles = ["super_admin", "admin", "manager", "cashier"];
  if (!userRole || !posRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  const isManager = MANAGER_ROLES.includes(userRole);
  const nav = [
    { href: "/pos", label: "Terminal" },
    { href: "/pos/shifts", label: "My Shifts" },
    { href: "/pos/receipts", label: "My Receipts" },
    ...(isManager ? [{ href: "/pos/reports", label: "Reports" }] : []),
  ];

  return (
    <div className="flex h-screen flex-col bg-navy-deep">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-navy px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/pos" className="text-lg font-semibold tracking-tight text-gold">
            Nobleman POS
          </Link>
          <nav className="flex gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isManager && <StoreSwitcher />}
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-white/40">{userRole.replace("_", " ")}</p>
            <p className="text-sm font-medium text-white">{session.user.name || "User"}</p>
          </div>
          <Link href="/" className="text-xs text-white/40 hover:text-white">
            Exit POS
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
