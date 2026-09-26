import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAdminProducts, deleteProduct } from "@/lib/admin/actions";
import { formatGHS } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminProductFilters } from "./products-filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; brand?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { items, total, totalPages } = await getAdminProducts({
    page,
    perPage: 20,
    search: params.search,
    categoryId: params.category,
    brandId: params.brand,
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-deep">Products</h1>
          <p className="text-sm text-charcoal/60">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-navy-deep px-4 py-2.5 text-sm font-medium text-cream hover:bg-navy"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <AdminProductFilters />

      <div className="mt-4 overflow-hidden rounded-xl border border-cream-dark bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-dark bg-cream/50">
              <tr>
                <th className="px-4 py-3 font-medium text-charcoal/60">Product</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Category</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Brand</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Price</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Stock</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Status</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {items.length > 0 ? (
                items.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt="" width={40} height={40} className="h-10 w-10 rounded-md object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-navy-deep">{product.name}</p>
                          <p className="text-xs text-charcoal/50">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{product.categoryName}</td>
                    <td className="px-4 py-3 text-charcoal/70">{product.brandName}</td>
                    <td className="px-4 py-3 font-medium text-navy-deep">{formatGHS(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={product.stock <= product.lowStockThreshold ? "font-bold text-kente-red" : "text-charcoal/70"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.isActive ? "bg-kente-green/10 text-kente-green" : "bg-charcoal/10 text-charcoal/50"
                      }`}>
                        {product.isActive ? "Active" : "Draft"}
                      </span>
                      {product.isFeatured && (
                        <span className="ml-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gold/10 text-gold">Featured</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="rounded p-1 text-charcoal/60 hover:bg-cream/50 hover:text-navy-deep">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <form action={async () => { "use server"; await deleteProduct(product.id); }}>
                          <button type="submit" className="rounded p-1 text-charcoal/60 hover:bg-kente-red/10 hover:text-kente-red">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-charcoal/50">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-charcoal/50">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/products?page=${page - 1}`} className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm hover:bg-cream/50">Previous</Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/products?page=${page + 1}`} className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm hover:bg-cream/50">Next</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
