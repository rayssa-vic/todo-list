import { Pool } from "pg";

// Reaproveita a conexão entre chamadas em dev (evita esgotar o pool com hot-reload)
let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}
