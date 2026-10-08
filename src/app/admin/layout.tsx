import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { StoreSwitcher } from "@/components/admin/store-switcher";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Nobleman Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = session.user.role;
  if (!["super_admin", "admin", "manager", "stock_keeper"].includes(role)) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-mist">
      <AdminSidebar currentPath="/admin" />
      <main className="ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white px-8 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-navy">Admin Panel</h1>
          <div className="flex flex-wrap items-center gap-4">
            <StoreSwitcher />
            <Link href="/" className="text-sm text-muted transition-colors hover:text-gold">
              View Store
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center border border-gold/30 bg-gold/10">
                <span className="text-xs font-bold text-gold">
                  {session.user.name?.[0] ?? "A"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-navy">{session.user.name}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted">{session.user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
