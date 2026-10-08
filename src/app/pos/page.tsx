"use client";

import { useState } from "react";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder products
const products = [
  { id: "1", name: "Fender Player Stratocaster", sku: "GTR-FEN-001", price: 4599.99, category: "Guitars" },
  { id: "2", name: "Yamaha C40 Classical Guitar", sku: "GTR-YAM-002", price: 699.99, category: "Guitars" },
  { id: "3", name: "Shure SM58 Microphone", sku: "MIC-SHU-001", price: 549.99, category: "Live Sound" },
  { id: "4", name: "Yamaha P-125 Digital Piano", sku: "KEY-YAM-001", price: 3299.99, category: "Keyboards" },
  { id: "5", name: "Roland FP-30X", sku: "KEY-ROL-001", price: 3799.99, category: "Keyboards" },
  { id: "6", name: "Gibson Les Paul Standard", sku: "GTR-GIB-001", price: 12999.99, category: "Guitars" },
  { id: "7", name: "Pearl Export 5pc Kit", sku: "DRM-PRL-001", price: 5499.99, category: "Drums" },
  { id: "8", name: "Audio-Technica AT2020", sku: "MIC-AUD-001", price: 499.99, category: "Recording" },
  { id: "9", name: "Fender Rumble 100", sku: "AMP-FEN-001", price: 1899.99, category: "Amps" },
  { id: "10", name: "Boss DS-1 Distortion", sku: "FX-BOSS-001", price: 349.99, category: "Effects" },
];

type CartItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
};

export default function POSTerminalPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, sku: product.sku, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.125; // 12.5% VAT
  const total = subtotal + tax;

  const handlePayment = (method: string) => {
    alert(`Payment processed: ${method}\nTotal: ${formatGHS(total)}\n\nReceipt would print here.`);
    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="flex h-full">
      {/* Left: Product search + grid */}
      <div className="flex flex-1 flex-col border-r border-white/10">
        {/* Search */}
        <div className="border-b border-white/10 p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or scan barcode..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            autoFocus
          />
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex flex-col rounded-lg border border-white/10 bg-white/5 p-3 text-left transition-colors hover:border-gold hover:bg-white/10"
              >
                <div className="mb-2 flex h-16 items-center justify-center rounded bg-white/5 text-2xl">
                  🎸
                </div>
                <p className="text-xs text-white/40">{product.sku}</p>
                <p className="text-sm font-medium text-white line-clamp-2">{product.name}</p>
                <p className="mt-1 text-sm font-bold text-gold">{formatGHS(product.price)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="flex w-96 flex-col bg-navy-deep">
        <div className="border-b border-white/10 p-4">
          <h2 className="font-display text-lg font-bold text-white">Current Sale</h2>
          <p className="text-xs text-white/40">{cart.length} items</p>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/40">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-white/40">{item.sku}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-white/40 hover:text-kente-red">
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="h-6 w-6 rounded bg-white/10 text-white hover:bg-white/20"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm text-white">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="h-6 w-6 rounded bg-white/10 text-white hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gold">{formatGHS(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals + checkout */}
        <div className="border-t border-white/10 p-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>{formatGHS(subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>VAT (12.5%)</span>
              <span>{formatGHS(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-gold">{formatGHS(total)}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setCart([])}
              className="rounded-lg border border-white/10 py-2 text-sm text-white/60 hover:bg-white/5"
            >
              Clear
            </button>
            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="rounded-lg bg-gold py-2 text-sm font-bold text-navy hover:bg-gold-light disabled:opacity-50"
            >
              Charge
            </button>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-navy p-6">
            <h2 className="font-display text-xl font-bold text-white">Payment</h2>
            <p className="mt-1 text-sm text-white/60">Total: {formatGHS(total)}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePayment("Cash")}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-center hover:border-gold hover:bg-white/10"
              >
                <p className="text-2xl">💵</p>
                <p className="mt-2 text-sm font-medium text-white">Cash</p>
              </button>
              <button
                onClick={() => handlePayment("Card")}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-center hover:border-gold hover:bg-white/10"
              >
                <p className="text-2xl">💳</p>
                <p className="mt-2 text-sm font-medium text-white">Card</p>
              </button>
              <button
                onClick={() => handlePayment("MTN MoMo")}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-center hover:border-gold hover:bg-white/10"
              >
                <p className="text-2xl">📱</p>
                <p className="mt-2 text-sm font-medium text-white">MTN MoMo</p>
              </button>
              <button
                onClick={() => handlePayment("Vodafone Cash")}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-center hover:border-gold hover:bg-white/10"
              >
                <p className="text-2xl">📲</p>
                <p className="mt-2 text-sm font-medium text-white">Vodafone Cash</p>
              </button>
            </div>

            <button
              onClick={() => setShowPayment(false)}
              className="mt-4 w-full rounded-lg border border-white/10 py-2 text-sm text-white/60 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
