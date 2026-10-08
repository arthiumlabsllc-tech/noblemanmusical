const addresses = [
  {
    id: 1,
    label: "Home",
    name: "John Doe",
    phone: "+233 24 123 4567",
    address: "123 Independence Avenue",
    city: "Accra",
    region: "Greater Accra",
    landmark: "Near Accra Mall",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    name: "John Doe",
    phone: "+233 24 123 4567",
    address: "45 Airport City Blvd",
    city: "Accra",
    region: "Greater Accra",
    landmark: "Opposite Marina Mall",
    isDefault: false,
  },
];

export default function AccountAddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy">My Addresses</h1>
        <button className="border border-navy bg-navy px-4 py-2 text-xs font-bold text-white transition-colors hover:border-gold hover:bg-gold">
          + Add New Address
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-line bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-mist px-2 py-0.5 text-xs font-medium text-navy">{addr.label}</span>
                {addr.isDefault && (
                  <span className="bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">Default</span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="text-underline-gold text-xs text-navy hover:text-gold">Edit</button>
                <button className="text-xs text-kente-red hover:underline">Delete</button>
              </div>
            </div>
            <div className="mt-3 space-y-0.5 text-sm text-body">
              <p className="font-medium text-navy">{addr.name}</p>
              <p>{addr.phone}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.region}</p>
              <p className="text-xs text-muted">Landmark: {addr.landmark}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
