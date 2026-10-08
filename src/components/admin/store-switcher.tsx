import { getActiveStore, getStores } from "@/lib/data/stores";
import { setActiveStoreAction } from "@/lib/actions/stores";

/**
 * Admin/POS active-store selector. Server-rendered; persists the choice in a
 * cookie via a server action, so inventory + POS are scoped to the chosen town
 * without re-authentication.
 */
export async function StoreSwitcher() {
  const allStores = await getStores();
  const active = await getActiveStore();

  return (
    <form action={setActiveStoreAction} className="flex items-center gap-2">
      <span className="hidden text-xs font-medium uppercase tracking-wider text-muted sm:inline">
        Store
      </span>
      <select
        name="store"
        defaultValue={active.slug}
        className="h-9 max-w-[15rem] cursor-pointer border border-line bg-white px-2 text-sm text-navy outline-none focus:border-gold"
      >
        {allStores.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
            {s.isPrimary ? " · HQ" : ""}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-9 border border-navy bg-navy px-3 text-xs font-medium text-white transition-colors hover:bg-white hover:text-navy"
      >
        Switch
      </button>
    </form>
  );
}
