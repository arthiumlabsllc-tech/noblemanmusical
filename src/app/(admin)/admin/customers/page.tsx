import type { Metadata } from "next";
import { getAdminCustomers } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { items, total, totalPages } = await getAdminCustomers({
    page,
    perPage: 20,
    search: params.search,
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Customers</h1>
        <p className="text-sm text-charcoal/60">{total} registered customers</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-dark bg-cream/50">
              <tr>
                <th className="px-4 py-3 font-medium text-charcoal/60">Name</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Email</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Phone</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Verified</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {items.length > 0 ? (
                items.map((customer) => (
                  <tr key={customer.id} className="hover:bg-cream/30">
                    <td className="px-4 py-3 font-medium text-navy-deep">{customer.name ?? "—"}</td>
                    <td className="px-4 py-3 text-charcoal/70">{customer.email}</td>
                    <td className="px-4 py-3 text-charcoal/70">{customer.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        customer.emailVerified ? "bg-kente-green/10 text-kente-green" : "bg-charcoal/10 text-charcoal/50"
                      }`}>
                        {customer.emailVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/50">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-charcoal/50">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-charcoal/50">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`/admin/customers?page=${page - 1}`} className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm hover:bg-cream/50">Previous</a>
            )}
            {page < totalPages && (
              <a href={`/admin/customers?page=${page + 1}`} className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm hover:bg-cream/50">Next</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
