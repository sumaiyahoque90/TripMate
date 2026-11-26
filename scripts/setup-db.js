// Usage: node --env-file=.env scripts/setup-db.js
// Applies schema.sql, seed.sql (only if hotels is empty) and creates the admin user.
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "") ? false : { rejectUnauthorized: true } });
  const sql = (f) => fs.readFileSync(path.join(__dirname, "..", "database", f), "utf8");
  await pool.query(sql("schema.sql"));
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM hotels");
  if (rows[0].n === 0) await pool.query(sql("seed.sql"));
  const email = (process.env.ADMIN_EMAIL || "admin@tripmate.local").toLowerCase();
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) console.log("ADMIN_PASSWORD not set: admin user not created.");
  else {
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role) VALUES ('TripMate Admin', $1, $2, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [email, await bcrypt.hash(pw, 12)]
    );
    console.log("Admin ready:", email);
  }
  await pool.end();
  console.log("Database setup complete.");
})().catch((e) => { console.error(e); process.exit(1); });
