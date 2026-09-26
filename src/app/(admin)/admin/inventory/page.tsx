import type { Metadata } from "next";
import Image from "next/image";
import { getLowStockProducts, updateProductStock } from "@/lib/admin/actions";
import { Warehouse } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Inventory" };

export default async function InventoryPage() {
  const lowStock = await getLowStockProducts();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
          <Warehouse className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-deep">Inventory</h1>
          <p className="text-sm text-charcoal/60">{lowStock.length} products below threshold</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-dark bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-charcoal/60">Product</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Category</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Current Stock</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Threshold</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Status</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {lowStock.length > 0 ? (
              lowStock.map((p) => (
                <tr key={p.id} className="hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt="" width={32} height={32} className="h-8 w-8 rounded object-cover" />
                      )}
                      <span className="font-medium text-navy-deep">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{p.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${p.stock <= 0 ? "text-kente-red" : "text-bronze"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{p.lowStockThreshold}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.stock <= 0
                        ? "bg-kente-red/10 text-kente-red"
                        : p.stock <= p.lowStockThreshold
                          ? "bg-bronze/10 text-bronze"
                          : "bg-kente-green/10 text-kente-green"
                    }`}>
                      {p.stock <= 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        const stock = Number(fd.get("stock"));
                        if (!isNaN(stock) && stock >= 0) {
                          await updateProductStock(p.id, stock);
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        defaultValue={p.stock}
                        className="w-20 rounded border border-cream-dark px-2 py-1 text-sm focus:border-gold focus:outline-none"
                      />
                      <button type="submit" className="rounded bg-navy-deep px-3 py-1 text-xs text-cream hover:bg-navy">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-charcoal/50">All stock levels are healthy</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
