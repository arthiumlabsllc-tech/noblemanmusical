import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, getAccountStats, getMyOrders } from "@/lib/account/actions";
import { formatGHS } from "@/lib/utils";
import { Package, Heart, MapPin, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Overview" };

export default async function AccountPage() {
  const [user, stats, recentOrders] = await Promise.all([
    getCurrentUser(),
    getAccountStats(),
    getMyOrders(),
  ]);

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-charcoal/60">Please sign in to view your account.</p>
        <Link href="/login" className="mt-4 inline-block text-sm text-gold">Sign in →</Link>
      </div>
    );
  }

  const recent = recentOrders.slice(0, 3);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Welcome, {user.name ?? "there"}</h1>
        <p className="text-sm text-charcoal/60">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-cream-dark bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
            <Package className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 text-xl font-bold text-navy-deep">{stats.totalOrders}</p>
          <p className="text-xs text-charcoal/50">Total Orders</p>
        </div>
        <div className="rounded-xl border border-cream-dark bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
            <DollarSign className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 text-xl font-bold text-navy-deep">{formatGHS(stats.totalSpent)}</p>
          <p className="text-xs text-charcoal/50">Total Spent</p>
        </div>
        <div className="rounded-xl border border-cream-dark bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
            <Heart className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 text-xl font-bold text-navy-deep">{stats.wishlistCount}</p>
          <p className="text-xs text-charcoal/50">Wishlist Items</p>
        </div>
        <div className="rounded-xl border border-cream-dark bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
            <MapPin className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 text-xl font-bold text-navy-deep">{stats.addressCount}</p>
          <p className="text-xs text-charcoal/50">Saved Addresses</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-cream-dark bg-white">
        <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4">
          <h3 className="font-medium text-navy-deep">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm text-gold hover:text-gold-light">View all</Link>
        </div>
        <div className="divide-y divide-cream-dark">
          {recent.length > 0 ? (
            recent.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-cream/30">
                <div>
                  <p className="text-sm font-medium text-navy-deep">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-navy-deep">{formatGHS(order.total)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.status === "delivered" ? "bg-kente-green/10 text-kente-green" :
                    order.status === "cancelled" ? "bg-kente-red/10 text-kente-red" :
                    "bg-gold/10 text-gold"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-charcoal/50">No orders yet</p>
              <Link href="/shop" className="mt-2 text-sm text-gold hover:text-gold-light">Start shopping →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
