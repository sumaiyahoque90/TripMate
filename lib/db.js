import pg from "pg";

const { Pool, types } = pg;
types.setTypeParser(1082, (v) => v); // keep DATE columns as "YYYY-MM-DD" strings (no timezone shifts)

// Reuse one pool across hot reloads in dev.
const globalForPg = globalThis;
const pool =
  globalForPg.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon requires TLS (valid certs). Local Postgres (localhost) runs without TLS.
    ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "") ? false : { rejectUnauthorized: true },
    max: 10,
  });
if (process.env.NODE_ENV !== "production") globalForPg.__pgPool = pool;

export async function query(text, params = []) {
  return pool.query(text, params);
}

// Run several statements atomically (booking creation, reward generation, voucher redemption).
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export default pool;
