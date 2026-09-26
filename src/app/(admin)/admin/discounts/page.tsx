import type { Metadata } from "next";
import { getAdminDiscounts, createDiscount, deleteDiscount } from "@/lib/admin/actions";
import { formatGHS } from "@/lib/utils";
import { Plus, Trash2, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Discounts" };

export default async function DiscountsPage() {
  const allDiscounts = await getAdminDiscounts();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
          <Tag className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-deep">Discounts</h1>
          <p className="text-sm text-charcoal/60">{allDiscounts.length} discount codes</p>
        </div>
      </div>

      {/* Create Discount Form */}
      <form action={async (fd: FormData) => { "use server"; await createDiscount(fd); }} className="mb-6 rounded-xl border border-cream-dark bg-white p-5">
        <h3 className="mb-4 font-medium text-navy-deep">Create Discount Code</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Code</label>
            <input name="code" required placeholder="e.g. SAVE20" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm uppercase focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Type</label>
            <select name="type" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none">
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed (GHS)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Value</label>
            <input name="value" type="number" min="0" required placeholder="10" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Min. Order (pesewas)</label>
            <input name="minOrder" type="number" min="0" defaultValue="0" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Usage Limit</label>
            <input name="usageLimit" type="number" min="0" placeholder="Unlimited" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Starts At</label>
            <input name="startsAt" type="datetime-local" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Ends At</label>
            <input name="endsAt" type="datetime-local" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-navy-deep px-4 py-2 text-sm font-medium text-cream hover:bg-navy">
              <Plus className="h-4 w-4" /> Create
            </button>
          </div>
        </div>
      </form>

      {/* Discounts List */}
      <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-dark bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-charcoal/60">Code</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Type</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Value</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Usage</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Status</th>
              <th className="px-4 py-3 font-medium text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {allDiscounts.length > 0 ? (
              allDiscounts.map((d) => (
                <tr key={d.id} className="hover:bg-cream/30">
                  <td className="px-4 py-3 font-mono font-medium text-navy-deep">{d.code}</td>
                  <td className="px-4 py-3 text-charcoal/70 capitalize">{d.type}</td>
                  <td className="px-4 py-3 font-medium text-navy-deep">
                    {d.type === "percent" ? `${d.value}%` : formatGHS(d.value)}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {d.usedCount}{d.usageLimit ? ` / ${d.usageLimit}` : " (unlimited)"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      d.isActive ? "bg-kente-green/10 text-kente-green" : "bg-charcoal/10 text-charcoal/50"
                    }`}>
                      {d.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => { "use server"; await deleteDiscount(d.id); }}>
                      <button type="submit" className="rounded p-1 text-charcoal/60 hover:bg-kente-red/10 hover:text-kente-red">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-charcoal/50">No discount codes yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
