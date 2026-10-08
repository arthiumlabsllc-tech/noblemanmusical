import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

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
    <div className="min-h-screen bg-cream">
      <AdminSidebar currentPath="/admin" />
      <main className="ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal/10 bg-white px-8 py-4">
          <div>
            <h1 className="text-lg font-semibold text-navy">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-charcoal/60 hover:text-gold">
              View Store
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-xs font-bold text-gold">
                  {session.user.name?.[0] ?? "A"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-navy">{session.user.name}</p>
                <p className="text-[10px] text-charcoal/40 capitalize">{session.user.role}</p>
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
