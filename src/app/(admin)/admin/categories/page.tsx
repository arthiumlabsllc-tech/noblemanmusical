import type { Metadata } from "next";
import { getAdminCategories, createCategory, deleteCategory } from "@/lib/admin/actions";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const allCategories = await getAdminCategories();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Categories</h1>
        <p className="text-sm text-charcoal/60">{allCategories.length} categories</p>
      </div>

      {/* Add Category Form */}
      <form action={async (fd: FormData) => { "use server"; await createCategory(fd); }} className="mb-6 rounded-xl border border-cream-dark bg-white p-5">
        <h3 className="mb-4 font-medium text-navy-deep">Add New Category</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Name</label>
            <input name="name" required className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Slug</label>
            <input name="slug" required className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Description</label>
            <input name="description" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-navy-deep px-4 py-2 text-sm font-medium text-cream hover:bg-navy">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </form>

      {/* Categories List */}
      <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-dark bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-charcoal/60">Name</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Slug</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Description</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Sort Order</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {allCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-cream/30">
                <td className="px-4 py-3 font-medium text-navy-deep">{cat.name}</td>
                <td className="px-4 py-3 text-charcoal/50">{cat.slug}</td>
                <td className="px-4 py-3 text-charcoal/70">{cat.description ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal/70">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                    <button type="submit" className="rounded p-1 text-charcoal/60 hover:bg-kente-red/10 hover:text-kente-red">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
