import type { Metadata } from "next";
import { getMyAddresses, createAddress, deleteAddress } from "@/lib/account/actions";
import { Plus, Trash2, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const allAddresses = await getMyAddresses();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-deep">Delivery Addresses</h1>

      {/* Add Address Form */}
      <form action={async (fd: FormData) => { "use server"; await createAddress(fd); }} className="mb-6 rounded-xl border border-cream-dark bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 font-medium text-navy-deep">
          <Plus className="h-4 w-4" /> Add New Address
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Label (e.g. Home, Office)</label>
            <input name="label" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Phone</label>
            <input name="phone" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Region *</label>
            <input name="region" required className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">City *</label>
            <input name="city" required className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Area</label>
            <input name="area" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-charcoal/60">Landmark</label>
            <input name="landmark" className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" name="isDefault" id="isDefault" className="rounded border-cream-dark" />
            <label htmlFor="isDefault" className="text-sm text-charcoal/70">Set as default address</label>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-navy-deep px-4 py-2 text-sm font-medium text-cream hover:bg-navy">
              <Plus className="h-4 w-4" /> Add Address
            </button>
          </div>
        </div>
      </form>

      {/* Address List */}
      {allAddresses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {allAddresses.map((addr) => (
            <div key={addr.id} className="relative rounded-xl border border-cream-dark bg-white p-5">
              {addr.isDefault && (
                <span className="absolute right-3 top-3 rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">Default</span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  {addr.label && <p className="text-sm font-medium text-navy-deep">{addr.label}</p>}
                  <p className="mt-1 text-sm text-charcoal/70">{addr.area}{addr.area && addr.city ? ", " : ""}{addr.city}</p>
                  <p className="text-sm text-charcoal/70">{addr.region}</p>
                  {addr.landmark && <p className="mt-1 text-xs text-charcoal/50">Near: {addr.landmark}</p>}
                  {addr.phone && <p className="mt-1 text-xs text-charcoal/50">{addr.phone}</p>}
                </div>
                <form action={async () => { "use server"; await deleteAddress(addr.id); }}>
                  <button type="submit" className="rounded p-1 text-charcoal/60 hover:bg-kente-red/10 hover:text-kente-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-cream-dark bg-white p-12 text-center">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-charcoal/50" />
          <p className="text-charcoal/60">No saved addresses. Add one above.</p>
        </div>
      )}
    </div>
  );
}
