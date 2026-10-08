import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * The Neon client is created lazily. Calling `neon()` with an undefined
 * connection string throws at module-evaluation time, which would crash every
 * page that (transitively) imports this module — even ones that only need the
 * database when a user is signed in. By deferring creation to the first actual
 * query, importing `db` is always safe and a missing DATABASE_URL only surfaces
 * when a query is genuinely attempted.
 */
function createClient() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema });
}

export type Database = ReturnType<typeof createClient>;

let client: Database | undefined;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): Database {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set — the database is not configured."
      );
    }
    client = createClient();
  }
  return client;
}

// Lazy proxy: `import { db }` never throws; only real queries do (without a URL).
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const value = Reflect.get(getDb(), prop, getDb());
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
});
