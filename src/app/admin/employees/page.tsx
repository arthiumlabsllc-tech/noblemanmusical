import { listEmployees } from "@/lib/data/admin";
import { getStores } from "@/lib/data/stores";
import { registerEmployeeAction } from "@/lib/actions/employees";
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

const STAFF_ROLES = ["manager", "cashier", "stock_keeper", "admin", "super_admin"];

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const [employees, stores] = await Promise.all([listEmployees(), getStores()]);

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Register staff logins. Cashiers and stock keepers are limited to their assigned store."
      />
      <Flash msg={sp.msg} error={sp.error} />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader title="Register Employee" />
          <form action={registerEmployeeAction} className="space-y-4 p-6">
            <Field label="Full Name" name="name" required placeholder="e.g. Ama Serwaa" />
            <Field label="Email" name="email" type="email" required placeholder="name@noblemangh.com" />
            <Field label="Temporary Password" name="password" type="password" required hint="Minimum 8 characters" />
            <Field label="Phone" name="phone" placeholder="+233 …" />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Role" name="role" defaultValue="cashier">
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </SelectField>
              <SelectField label="Store" name="storeId" defaultValue={stores[0]?.id}>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </SelectField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee Code" name="employeeCode" placeholder="EMP-003" />
              <Field label="Department" name="department" placeholder="Sales" />
            </div>
            <PrimaryButton className="w-full">Register Employee</PrimaryButton>
          </form>
        </Card>

        <Card>
          <CardHeader title={`${employees.length} team members`} />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Store</th>
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td className="px-6 py-3">
                      <p className="font-medium text-navy">{e.name}</p>
                      <p className="text-xs text-muted">{e.email}</p>
                    </td>
                    <td className="px-6 py-3 capitalize text-body">{e.role.replace("_", " ")}</td>
                    <td className="px-6 py-3 text-muted">{e.storeName ?? "—"}</td>
                    <td className="px-6 py-3 text-muted">{e.employeeCode ?? "—"}</td>
                    <td className="px-6 py-3">
                      <Badge tone={e.status === "active" ? "green" : "neutral"}>{e.status}</Badge>
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
