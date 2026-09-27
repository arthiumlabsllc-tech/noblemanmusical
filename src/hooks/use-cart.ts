import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trackAddToCart, trackRemoveFromCart } from "@/lib/analytics/events";

export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  price: number; // pesewas
  image: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        // Read the pre-mutation state so the event can report the quantity the
        // stock clamp actually allowed, rather than the quantity requested.
        const existing = get().items.find((i) => i.slug === item.slug);
        const finalQuantity = existing
          ? Math.min(existing.quantity + quantity, item.maxStock)
          : quantity;

        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === item.slug
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });

        // Tracked here rather than in each component so no call site can be
        // missed — product pages, the drawer and quick-add all funnel through.
        trackAddToCart({
          productId: item.slug,
          productName: item.name,
          price: item.price,
          brand: item.brand,
          quantity: finalQuantity,
        });
      },

      removeItem: (slug) => {
        const removed = get().items.find((i) => i.slug === slug);

        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) }));

        if (removed) {
          trackRemoveFromCart({
            productId: removed.slug,
            productName: removed.name,
            price: removed.price,
            quantity: removed.quantity,
          });
        }
      },

      updateQuantity: (slug, quantity) => {
        if (quantity <= 0) {
          get().removeItem(slug);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "nmc-cart" }
  )
);
