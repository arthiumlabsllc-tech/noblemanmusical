import type { Metadata } from "next";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountHeader } from "@/components/account/account-header";

export const metadata: Metadata = {
  title: {
    template: "%s | My Account",
    default: "Account",
  },
  // Personalised order/address data must never reach a search index.
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const sidebarNav = <AccountSidebar variant="drawer" />;

  return (
    <div className="min-h-screen bg-cream">
      <AccountHeader sidebar={sidebarNav} />
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-cream-dark bg-white lg:block">
          <AccountSidebar variant="desktop" />
        </aside>
        <main className="flex-1 overflow-x-hidden px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
