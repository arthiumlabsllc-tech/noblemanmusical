import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: {
    template: "%s | Nobleman Admin",
    default: "Admin",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarNav = <AdminSidebar variant="drawer" />;

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader sidebar={sidebarNav} />
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-cream-dark bg-white lg:block">
          <AdminSidebar variant="desktop" />
        </aside>
        <main className="flex-1 overflow-x-hidden px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
