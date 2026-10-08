"use client";

import { useMemo, useState } from "react";
import { formatGHS } from "@/lib/utils/formatGHS";
import { recordSaleAction } from "@/lib/actions/pos";

export type PosProduct = {
  id: string;
  name: string;
  price: number;
  tag: string;
  stock: number;
};

type Line = { product: PosProduct; qty: number };

const VAT_RATE = 0.125;

export function PosTerminal({
  products,
  storeId,
  storeName,
}: {
  products: PosProduct[];
  storeId: string;
  storeName: string;
}) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [paying, setPaying] = useState(false);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
  }, [products, search]);

  const lines: Line[] = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id)!, qty }))
    .filter((l) => l.product && l.qty > 0);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      const n = (next[id] || 0) - 1;
      if (n > 0) next[id] = n;
      else delete next[id];
      return next;
    });

  async function charge(method: string) {
    setBusy(true);
    const fd = new FormData();
    fd.set("storeId", storeId);
    fd.set("paymentMethod", method);
    fd.set("customerName", customerName);
    fd.set(
      "items",
      JSON.stringify(
        lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          unitPrice: l.product.price,
          quantity: l.qty,
        }))
      )
    );
    await recordSaleAction(fd); // redirects to /pos?msg=sale&receipt=…
    setBusy(false);
  }

  return (
    <div className="flex h-full">
      {/* Catalog */}
      <div className="flex flex-1 flex-col border-r border-white/10">
        <div className="border-b border-white/10 p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="h-11 w-full border border-white/15 bg-white/5 px-4 text-white placeholder-white/40 outline-none focus:border-gold"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => {
              const out = p.stock <= 0;
              return (
                <button
                  key={p.id}
                  disabled={out}
                  onClick={() => add(p.id)}
                  className="flex flex-col border border-white/10 bg-white/5 p-3 text-left transition-colors hover:border-gold hover:bg-white/10 disabled:opacity-40"
                >
                  <p className="text-[11px] uppercase tracking-wide text-white/40">{p.tag}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-white">{p.name}</p>
                  <p className="mt-2 text-sm font-bold text-gold">{formatGHS(p.price)}</p>
                  <p className="mt-0.5 text-[11px] text-white/40">{out ? "Out of stock" : `${p.stock} in stock`}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart */}
      <div className="flex w-[22rem] flex-col bg-navy-deep">
        <div className="border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold text-white">Current Sale</h2>
          <p className="text-xs text-white/40">{storeName} · {lines.reduce((s, l) => s + l.qty, 0)} items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-white/40">Cart is empty</p>
          ) : (
            <div className="space-y-2">
              {lines.map((l) => (
                <div key={l.product.id} className="border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between">
                    <p className="line-clamp-1 flex-1 text-sm font-medium text-white">{l.product.name}</p>
                    <button onClick={() => dec(l.product.id)} className="ml-2 text-white/40 hover:text-kente-red">✕</button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => dec(l.product.id)} className="h-7 w-7 border border-white/15 text-white hover:bg-white/10">−</button>
                      <span className="w-6 text-center text-sm text-white">{l.qty}</span>
                      <button onClick={() => add(l.product.id)} className="h-7 w-7 border border-white/15 text-white hover:bg-white/10">+</button>
                    </div>
                    <p className="text-sm font-bold text-gold">{formatGHS(l.product.price * l.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name (optional)"
            className="mb-3 h-9 w-full border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
          />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{formatGHS(subtotal)}</span></div>
            <div className="flex justify-between text-white/60"><span>VAT (12.5%)</span><span>{formatGHS(vat)}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-white">
              <span>Total</span><span className="text-gold">{formatGHS(total)}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setCart({})} disabled={busy} className="border border-white/15 py-2 text-sm text-white/60 hover:bg-white/5 disabled:opacity-50">Clear</button>
            <button onClick={() => setPaying(true)} disabled={lines.length === 0 || busy} className="border border-gold bg-gold py-2 text-sm font-bold text-navy transition-colors hover:bg-gold-light disabled:opacity-40">Charge</button>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {paying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md border border-white/10 bg-navy p-6">
            <h2 className="text-lg font-semibold text-white">Take Payment</h2>
            <p className="mt-1 text-sm text-white/60">Total: <span className="font-bold text-gold">{formatGHS(total)}</span></p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { m: "cash", label: "Cash" },
                { m: "card", label: "Card" },
                { m: "momo", label: "MTN MoMo" },
                { m: "split", label: "Split" },
              ].map((opt) => (
                <button
                  key={opt.m}
                  onClick={() => charge(opt.m)}
                  disabled={busy}
                  className="border border-white/15 bg-white/5 py-4 text-sm font-medium text-white transition-colors hover:border-gold hover:bg-white/10 disabled:opacity-50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button onClick={() => setPaying(false)} disabled={busy} className="mt-4 w-full border border-white/15 py-2 text-sm text-white/60 hover:bg-white/5">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
