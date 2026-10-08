import { getActiveStore, getStores } from "@/lib/data/stores";
import { Badge, Card, PageHeader } from "@/components/admin/ui";

export default async function StoresPage() {
  const [stores, active] = await Promise.all([getStores(), getActiveStore()]);

  return (
    <div>
      <PageHeader
        title="Stores"
        subtitle="Every town/brand runs on one shared catalog with its own stock and staff."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <Card key={s.id} className={s.id === active.id ? "ring-1 ring-gold" : undefined}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold text-navy">{s.name}</h2>
                {s.isPrimary ? <Badge tone="gold">HQ</Badge> : <Badge>{s.region ?? "Store"}</Badge>}
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Town</dt>
                  <dd className="text-body">{s.town ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Brand</dt>
                  <dd className="text-body">{s.brandName ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Slug</dt>
                  <dd className="text-body">{s.slug}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-muted">
                {s.id === active.id ? "Currently active in the switcher" : "Switch to this store from the header"}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
