import { formatGHS } from "@/lib/utils/formatGHS";
import { getInventory } from "@/lib/data/admin";
import { getActiveStore } from "@/lib/data/stores";
import { adjustStockAction } from "@/lib/actions/inventory";
import { Badge, Card, CardHeader, Flash, PageHeader } from "@/components/admin/ui";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const store = await getActiveStore();
  const rows = await getInventory(store.id);

  return (
    <div>
      <PageHeader
        title="Inventory & Stock"
        subtitle={`Shared catalog — quantities below are for ${store.name}.`}
      />
      <Flash msg={sp.msg} error={sp.error} />

      <Card>
        <CardHeader title={`${rows.length} products`} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Brand</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 text-right font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.productId} className="hover:bg-mist/60">
                  <td className="px-6 py-3 font-medium text-navy">{r.name}</td>
                  <td className="px-6 py-3 text-muted">{r.brand}</td>
                  <td className="px-6 py-3 text-body">{formatGHS(r.price)}</td>
                  <td className="px-6 py-3 text-right">
                    <Badge tone={r.storeQty <= 3 ? "red" : r.storeQty <= 5 ? "gold" : "green"}>
                      {r.storeQty}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <form action={adjustStockAction} className="flex items-center gap-2">
                      <input type="hidden" name="productId" value={r.productId} />
                      <input type="hidden" name="storeId" value={store.id} />
                      <input
                        type="number"
                        name="qty"
                        defaultValue={r.storeQty}
                        className="h-9 w-24 border border-line bg-white px-2 text-sm text-navy outline-none focus:border-gold"
                      />
                      <button
                        type="submit"
                        name="mode"
                        value="set"
                        className="h-9 border border-navy bg-navy px-3 text-xs font-medium text-white transition-colors hover:bg-white hover:text-navy"
                      >
                        Set
                      </button>
                      <button
                        type="submit"
                        name="mode"
                        value="delta"
                        className="h-9 border border-gold bg-gold px-3 text-xs font-medium text-white transition-colors hover:bg-navy hover:border-navy"
                        title="Add this amount to current stock"
                      >
                        + Restock
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
