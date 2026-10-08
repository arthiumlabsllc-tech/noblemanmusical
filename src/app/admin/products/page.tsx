import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const products = [
  { slug: "fender-player-stratocaster", name: "Fender Player Stratocaster", brand: "Fender", category: "Guitars", price: 4599.99, stock: 12, status: "active" },
  { slug: "gibson-les-paul-standard", name: "Gibson Les Paul Standard '50s", brand: "Gibson", category: "Guitars", price: 12999.99, stock: 3, status: "active" },
  { slug: "yamaha-c40-classical", name: "Yamaha C40 Classical Guitar", brand: "Yamaha", category: "Guitars", price: 699.99, stock: 25, status: "active" },
  { slug: "fender-blues-junior", name: "Fender Blues Junior IV", brand: "Fender", category: "Amps & Effects", price: 3999.99, stock: 5, status: "active" },
  { slug: "shure-sm58", name: "Shure SM58 Vocal Microphone", brand: "Shure", category: "Live Sound", price: 549.99, stock: 40, status: "active" },
  { slug: "roland-fp-30x", name: "Roland FP-30X Digital Piano", brand: "Roland", category: "Keyboards", price: 3799.99, stock: 6, status: "active" },
  { slug: "yamaha-stage-custom", name: "Yamaha Stage Custom Birch 5pc", brand: "Yamaha", category: "Drums", price: 5999.99, stock: 4, status: "active" },
  { slug: "akai-mpk-mini-mk3", name: "AKAI MPK mini mk3", brand: "AKAI Professional", category: "Keyboards", price: 699.99, stock: 20, status: "active" },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Products</h1>
          <p className="text-sm text-charcoal/60">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-gold px-4 py-2 text-sm font-bold text-navy hover:bg-gold-light"
        >
          + Add Product
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 rounded-md border border-charcoal/20 px-4 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <select className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-gold focus:outline-none">
          <option>All Categories</option>
          <option>Guitars</option>
          <option>Basses</option>
          <option>Amps & Effects</option>
          <option>Drums</option>
          <option>Keyboards</option>
          <option>Live Sound</option>
          <option>Recording</option>
        </select>
        <select className="rounded-md border border-charcoal/20 px-3 py-2 text-sm focus:border-gold focus:outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream/50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Product</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Category</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Price</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Stock</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Status</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {products.map((product) => (
              <tr key={product.slug} className="hover:bg-cream/30">
                <td className="px-6 py-4">
                  <p className="font-medium text-navy">{product.name}</p>
                  <p className="text-xs text-charcoal/40">{product.brand}</p>
                </td>
                <td className="px-6 py-4 text-xs text-charcoal/60">{product.category}</td>
                <td className="px-6 py-4 font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatGHS(product.price)}
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    product.stock <= 5
                      ? "bg-kente-red/10 text-kente-red"
                      : "bg-kente-green/10 text-kente-green"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-kente-green/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-kente-green">
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.slug}`} className="text-xs font-medium text-gold hover:text-gold-light">
                      Edit
                    </Link>
                    <button className="text-xs font-medium text-charcoal/40 hover:text-kente-red">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
