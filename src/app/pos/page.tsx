import { auth } from "@/lib/auth";
import { getActiveStore } from "@/lib/data/stores";
import { getInventory, getPosReceipts } from "@/lib/data/admin";
import { PosTerminal, type PosProduct } from "@/components/pos/pos-terminal";
import { formatGHS } from "@/lib/utils/formatGHS";

/**
 * POS terminal (employee dashboard landing).
 *
 * Server component: resolves the active store, its per-store catalog and the
 * most recent receipts, then hands the catalog to the client terminal. Cashiers
 * only ever see their assigned store (the switcher is manager-only in the layout)
 * and the layout already gated access to POS roles.
 */
export default async function POSTerminalPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; receipt?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const store = await getActiveStore();

  const [inventory, receipts] = await Promise.all([
    getInventory(store.id),
    getPosReceipts({ storeId: store.id, limit: 6 }),
  ]);

  const products: PosProduct[] = inventory.map((c) => ({
    id: c.productId,
    name: c.name,
    price: c.price,
    tag: c.brand,
    stock: c.storeQty,
  }));

  const todayTotal = receipts.reduce((s, r) => s + r.total, 0);
  const outOfStock = products.filter((p) => p.stock <= 0).length;

  const saleFlash =
    sp.msg === "sale"
      ? `Sale recorded${sp.receipt ? ` · Receipt ${sp.receipt}` : ""}.`
      : sp.error === "db"
        ? "Database not configured — connect DATABASE_URL to record real sales."
        : sp.error === "failed"
          ? "That sale could not be saved. Please try again."
          : sp.error === "invalid"
            ? "Nothing to charge — add items before taking payment."
            : null;
  const saleBad = sp.error === "db" || sp.error === "failed" || sp.error === "invalid";

  return (
    <div className="flex h-full flex-col">
      {/* Sale flash */}
      {saleFlash && (
        <div
          className={
            saleBad
              ? "border-b border-kente-red/40 bg-kente-red/10 px-4 py-2 text-sm text-white"
              : "border-b border-kente-green/40 bg-kente-green/10 px-4 py-2 text-sm text-white"
          }
        >
          {saleFlash}
        </div>
      )}

      {/* Store + shift summary strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-navy px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Signed in · {session?.user?.role?.replace("_", " ") ?? "staff"}</p>
          <h1 className="text-lg font-semibold text-white">
            {session?.user?.name || "Cashier"} — {store.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">Catalog</p>
            <p className="font-semibold text-white">{products.length} products</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">Out of stock</p>
            <p className={outOfStock ? "font-semibold text-kente-red" : "font-semibold text-white"}>{outOfStock}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">Recent sales</p>
            <p className="font-semibold text-gold">{receipts.length} · {formatGHS(todayTotal)}</p>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 overflow-hidden">
        <PosTerminal products={products} storeId={store.id} storeName={store.name} />
      </div>
    </div>
  );
}
