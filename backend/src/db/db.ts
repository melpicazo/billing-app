import pg from "pg";
const { Pool } = pg;

// Only create connection when needed
export function getConnection() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}
