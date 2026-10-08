import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";
import { getDashboardStats, getInventory, getRecentOrders } from "@/lib/data/admin";
import { getActiveStore } from "@/lib/data/stores";
import { Badge, Card, CardHeader, Flash, PageHeader, StatCard } from "@/components/admin/ui";

const statusTone: Record<string, "neutral" | "green" | "gold" | "red"> = {
  pending: "neutral",
  confirmed: "gold",
  processing: "gold",
  paid: "green",
  shipped: "green",
  delivered: "green",
  cancelled: "red",
  refunded: "red",
};

const quickActions = [
  { href: "/admin/inventory", title: "Adjust Stock", sub: "Add or set per-store quantities" },
  { href: "/admin/discounts", title: "Create Discount", sub: "Percentage or fixed codes" },
  { href: "/admin/employees", title: "Register Employee", sub: "Staff login, role & store" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const activeStore = await getActiveStore();
  const [stats, orders, inventory] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(5),
    getInventory(activeStore.id),
  ]);
  const lowStock = inventory.filter((i) => i.storeQty <= 5).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Overview for ${activeStore.name}`}
      />
      <Flash msg={sp.msg} error={sp.error} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatGHS(stats.revenue)} hint="paid orders" />
        <StatCard label="Orders" value={String(stats.orders)} />
        <StatCard label="Products" value={String(stats.products)} />
        <StatCard label="Low Stock" value={String(stats.lowStock)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent Orders"
            right={
              <Link href="/admin/orders" className="text-xs font-medium text-gold hover:text-navy">
                View all →
              </Link>
            }
          />
          <div className="divide-y divide-line">
            {orders.map((o) => (
              <div key={o.orderNumber} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{o.orderNumber}</p>
                  <p className="text-xs text-muted">{o.customer} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy">{formatGHS(o.total)}</p>
                  <Badge tone={statusTone[o.status] ?? "neutral"}>{o.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title={`Low Stock · ${activeStore.town ?? "Store"}`}
            right={
              <Link href="/admin/inventory" className="text-xs font-medium text-gold hover:text-navy">
                Manage →
              </Link>
            }
          />
          <div className="divide-y divide-line">
            {lowStock.length === 0 && (
              <p className="px-6 py-6 text-sm text-muted">No low-stock items in this store.</p>
            )}
            {lowStock.map((p) => (
              <div key={p.productId} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{p.name}</p>
                  <p className="text-xs text-muted">{p.brand} · {formatGHS(p.price)}</p>
                </div>
                <Badge tone={p.storeQty <= 3 ? "red" : "gold"}>{p.storeQty} left</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid gap-3 p-6 sm:grid-cols-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="border border-line p-4 transition-colors hover:border-gold hover:bg-gold/5"
            >
              <p className="text-sm font-semibold text-navy">{a.title}</p>
              <p className="mt-1 text-xs text-muted">{a.sub}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
