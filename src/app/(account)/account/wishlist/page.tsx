import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMyWishlist, removeFromWishlist } from "@/lib/account/actions";
import { formatGHS } from "@/lib/utils";
import { Heart, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const items = await getMyWishlist();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-deep">My Wishlist</h1>

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-cream-dark bg-white overflow-hidden">
              {item.images[0] && (
                <Image src={item.images[0]} alt={item.name} width={400} height={160} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <Link href={`/product/${item.slug}`} className="text-sm font-medium text-navy-deep hover:text-gold">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-navy-deep">{formatGHS(item.price)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs ${item.stock > 0 ? "text-kente-green" : "text-kente-red"}`}>
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  <form action={async () => { "use server"; await removeFromWishlist(item.productId); }}>
                    <button type="submit" className="rounded p-1 text-charcoal/60 hover:bg-kente-red/10 hover:text-kente-red">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-cream-dark bg-white p-12 text-center">
          <Heart className="mx-auto mb-3 h-8 w-8 text-charcoal/50" />
          <p className="text-charcoal/60">Your wishlist is empty. Browse products and tap the heart to save items.</p>
          <Link href="/shop" className="mt-4 inline-flex rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light">Browse Products</Link>
        </div>
      )}
    </div>
  );
}
