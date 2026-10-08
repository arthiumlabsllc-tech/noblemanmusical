import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "POS Terminal",
  description: "Point of Sale terminal for Nobleman Musical Center retail store.",
};

const posNav = [
  { href: "/pos", label: "Terminal", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href: "/pos/shifts", label: "Shifts", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/pos/reports", label: "Reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

export default async function POSLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/pos");
  }

  // Check if user has POS access (Cashier, Manager, Admin, Super Admin)
  const userRole = session.user.role;
  const posRoles = ["super_admin", "admin", "manager", "cashier"];
  if (!userRole || !posRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen flex-col bg-navy-deep">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-navy px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/pos" className="font-display text-lg font-bold text-gold">
            Nobleman POS
          </Link>
          <nav className="flex gap-1">
            {posNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-white/40">Cashier</p>
            <p className="text-sm font-medium text-white">{session.user.name || "User"}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-sm font-bold text-gold">
              {(session.user.name || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <Link href="/" className="text-xs text-white/40 hover:text-white">
            Exit POS
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
