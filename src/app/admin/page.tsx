import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data — will be replaced with DB queries
const stats = [
  { label: "Total Revenue", value: formatGHS(45299.90), change: "+12.5%", trend: "up" },
  { label: "Orders", value: "128", change: "+8.2%", trend: "up" },
  { label: "Products", value: "36", change: "+3", trend: "up" },
  { label: "Customers", value: "89", change: "+15.3%", trend: "up" },
];

const recentOrders = [
  { id: "NMC-ABC123", customer: "Pastor Mensah", total: 4599.99, status: "paid", date: "2024-09-27" },
  { id: "NMC-DEF456", customer: "Grace Chapel", total: 12999.99, status: "processing", date: "2024-09-26" },
  { id: "NMC-GHI789", customer: "Kwame A.", total: 699.99, status: "shipped", date: "2024-09-25" },
  { id: "NMC-JKL012", customer: "Joy FM", total: 2199.99, status: "delivered", date: "2024-09-24" },
  { id: "NMC-MNO345", customer: "Ama D.", total: 549.99, status: "pending", date: "2024-09-24" },
];

const lowStockProducts = [
  { name: "Gibson Les Paul Standard '50s", stock: 3, price: 12999.99 },
  { name: "Roland TD-17KV Electronic Kit", stock: 3, price: 7499.99 },
  { name: "AKAI Force Standalone", stock: 3, price: 4999.99 },
  { name: "Yamaha Stagepas 400i", stock: 3, price: 5999.99 },
  { name: "Fender Blues Junior IV", stock: 5, price: 3999.99 },
];

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-gold/10 text-gold",
  paid: "bg-kente-green/10 text-kente-green",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
  refunded: "bg-charcoal/10 text-charcoal",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-charcoal/10 bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal/60">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-navy">{stat.value}</p>
            <p className="mt-1 text-xs text-kente-green">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-lg border border-charcoal/10 bg-white">
          <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
            <h2 className="font-display text-lg font-bold text-navy">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-gold hover:text-gold-light">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-charcoal/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{order.id}</p>
                  <p className="text-xs text-charcoal/60">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatGHS(order.total)}
                  </p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="rounded-lg border border-charcoal/10 bg-white">
          <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
            <h2 className="font-display text-lg font-bold text-navy">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-xs font-medium text-gold hover:text-gold-light">
              Manage →
            </Link>
          </div>
          <div className="divide-y divide-charcoal/5">
            {lowStockProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{product.name}</p>
                  <p className="text-xs text-charcoal/60">{formatGHS(product.price)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  product.stock <= 3 ? "bg-kente-red/10 text-kente-red" : "bg-gold/10 text-gold"
                }`}>
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-lg border border-charcoal/10 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-navy">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/admin/products/new" className="rounded-md border border-charcoal/10 p-4 text-center transition-colors hover:border-gold hover:bg-gold/5">
            <p className="text-sm font-semibold text-navy">Add Product</p>
            <p className="mt-1 text-xs text-charcoal/60">Create a new listing</p>
          </Link>
          <Link href="/admin/orders" className="rounded-md border border-charcoal/10 p-4 text-center transition-colors hover:border-gold hover:bg-gold/5">
            <p className="text-sm font-semibold text-navy">Manage Orders</p>
            <p className="mt-1 text-xs text-charcoal/60">View & process orders</p>
          </Link>
          <Link href="/admin/quotes" className="rounded-md border border-charcoal/10 p-4 text-center transition-colors hover:border-gold hover:bg-gold/5">
            <p className="text-sm font-semibold text-navy">Respond to Quotes</p>
            <p className="mt-1 text-xs text-charcoal/60">Handle B2B inquiries</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
