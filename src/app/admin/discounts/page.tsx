import { formatGHS } from "@/lib/utils/formatGHS";
import { listDiscounts } from "@/lib/data/admin";
import { createDiscountAction, toggleDiscountAction } from "@/lib/actions/discounts";
import {
  Badge,
  Card,
  CardHeader,
  Field,
  Flash,
  PageHeader,
  PrimaryButton,
  SelectField,
} from "@/components/admin/ui";

export default async function DiscountsPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string; code?: string }>;
}) {
  const sp = await searchParams;
  const rows = await listDiscounts();

  return (
    <div>
      <PageHeader title="Discounts" subtitle="Create and manage coupon codes across all stores." />
      <Flash msg={sp.msg} error={sp.error} />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader title="New Discount" />
          <form action={createDiscountAction} className="space-y-4 p-6">
            <Field label="Code" name="code" placeholder="e.g. WELCOME10" required />
            <SelectField label="Type" name="type" defaultValue="percentage">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount (GH₵)</option>
            </SelectField>
            <Field label="Value" name="value" type="number" step="0.01" min="0.01" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Min Order" name="minOrder" type="number" step="0.01" min="0" placeholder="0" />
              <Field label="Usage Limit" name="usageLimit" type="number" min="1" placeholder="∞" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Starts" name="startsAt" type="date" />
              <Field label="Ends" name="endsAt" type="date" />
            </div>
            <PrimaryButton className="w-full">Create Discount</PrimaryButton>
          </form>
        </Card>

        <Card>
          <CardHeader title={`${rows.length} discounts`} />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Value</th>
                  <th className="px-6 py-3 font-medium">Min Order</th>
                  <th className="px-6 py-3 font-medium">Used</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td className="px-6 py-3">
                      <p className="font-semibold text-navy">{d.code}</p>
                      <p className="text-xs text-muted">{d.type}</p>
                    </td>
                    <td className="px-6 py-3 text-body">
                      {d.type === "percentage" ? `${d.value}%` : formatGHS(d.value)}
                    </td>
                    <td className="px-6 py-3 text-muted">{d.minOrder ? formatGHS(d.minOrder) : "—"}</td>
                    <td className="px-6 py-3 text-muted">
                      {d.usedCount}
                      {d.usageLimit ? ` / ${d.usageLimit}` : ""}
                    </td>
                    <td className="px-6 py-3">
                      <Badge tone={d.isActive ? "green" : "neutral"}>
                        {d.isActive ? "Active" : "Off"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <form action={toggleDiscountAction}>
                        <input type="hidden" name="id" value={d.id} />
                        <button
                          type="submit"
                          className="border border-line px-3 py-1.5 text-xs font-medium text-navy transition-colors hover:border-navy"
                        >
                          {d.isActive ? "Deactivate" : "Activate"}
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
    </div>
  );
}
