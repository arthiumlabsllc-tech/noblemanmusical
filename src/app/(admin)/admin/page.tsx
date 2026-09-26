import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { getAdminStats, getLowStockProducts, getAdminOrders } from "@/lib/admin/actions";
import { formatGHS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [stats, lowStock, recentOrders] = await Promise.all([
    getAdminStats(),
    getLowStockProducts(),
    getAdminOrders({ page: 1, perPage: 5 }),
  ]);

  const statCards = [
    { label: "Total Revenue", value: formatGHS(stats.revenue), icon: DollarSign, sub: "All time" },
    { label: "Total Orders", value: String(stats.orders), icon: ShoppingBag, sub: "All statuses" },
    { label: "Customers", value: String(stats.customers), icon: Users, sub: "Registered" },
    { label: "Products", value: String(stats.products), icon: Package, sub: `${stats.lowStock} low stock` },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-deep">Dashboard</h1>
        <p className="mt-1 text-sm text-charcoal/60">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-cream-dark bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <stat.icon className="h-5 w-5 text-gold" />
              </div>
              <TrendingUp className="h-4 w-4 text-kente-green/60" />
            </div>
            <p className="mt-3 tabular-nums text-2xl font-bold text-navy-deep">{stat.value}</p>
            <p className="text-xs text-charcoal/50">{stat.label}</p>
            <p className="mt-0.5 text-xs text-charcoal/60">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-cream-dark bg-white">
          <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4">
            <h3 className="font-medium text-navy-deep">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-gold hover:text-gold-light">View all</Link>
          </div>
          <div className="divide-y divide-cream-dark">
            {recentOrders.items.length > 0 ? (
              recentOrders.items.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-cream/30"
                >
                  <div>
                    <p className="text-sm font-medium text-navy-deep">{order.orderNumber}</p>
                    <p className="text-xs text-charcoal/50">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-navy-deep">{formatGHS(order.total)}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "paid" || order.status === "delivered"
                        ? "bg-kente-green/10 text-kente-green"
                        : order.status === "cancelled" || order.status === "refunded"
                          ? "bg-kente-red/10 text-kente-red"
                          : "bg-gold/10 text-gold"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-charcoal/50">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-xl border border-cream-dark bg-white">
          <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-bronze" />
              <h3 className="font-medium text-navy-deep">Low Stock Alerts</h3>
            </div>
            <Link href="/admin/inventory" className="text-sm text-gold hover:text-gold-light">Manage</Link>
          </div>
          <div className="divide-y divide-cream-dark">
            {lowStock.length > 0 ? (
              lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-navy-deep">{p.name}</p>
                    <p className="text-xs text-charcoal/50">{p.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${p.stock <= 0 ? "text-kente-red" : "text-bronze"}`}>
                      {p.stock} left
                    </p>
                    <p className="text-xs text-charcoal/60">Threshold: {p.lowStockThreshold}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-charcoal/50">All stock levels are healthy</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
