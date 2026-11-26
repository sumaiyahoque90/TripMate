import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle } from "@/lib/api";
import { RESOURCES, buildWrite } from "@/lib/adminResources";

export const GET = handle(async (_req, { params }) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const cfg = RESOURCES[(await params).resource]; if (!cfg) return fail("Unknown resource.", 404);
  const { rows } = await query(`SELECT * FROM ${cfg.table} ORDER BY ${cfg.order}`);
  return ok({ rows, fields: cfg.fields });
});

export const POST = handle(async (req, { params }) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const cfg = RESOURCES[(await params).resource]; if (!cfg) return fail("Unknown resource.", 404);
  const { cols, vals } = buildWrite(cfg, await readJson(req), { partial: false });
  const { rows } = await query(`INSERT INTO ${cfg.table} (${cols.join(",")}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`, vals);
  return ok({ row: rows[0] }, 201);
});
