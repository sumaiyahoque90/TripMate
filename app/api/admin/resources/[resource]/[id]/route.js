import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle, intParam } from "@/lib/api";
import { RESOURCES, buildWrite } from "@/lib/adminResources";

export const PUT = handle(async (req, { params }) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const cfg = RESOURCES[(await params).resource]; const id = intParam((await params).id);
  if (!cfg || !id) return fail("Not found.", 404);
  const { cols, vals } = buildWrite(cfg, await readJson(req), { partial: true });
  const { rows } = await query(`UPDATE ${cfg.table} SET ${cols.map((c, i) => `${c}=$${i + 1}`).join(",")} WHERE id=$${cols.length + 1} RETURNING *`, [...vals, id]);
  return rows[0] ? ok({ row: rows[0] }) : fail("Not found.", 404);
});

// Archive (soft delete) so existing bookings keep their references.
export const DELETE = handle(async (_req, { params }) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const cfg = RESOURCES[(await params).resource]; const id = intParam((await params).id);
  if (!cfg || !id) return fail("Not found.", 404);
  const { rowCount } = await query(`UPDATE ${cfg.table} SET is_active=FALSE WHERE id=$1`, [id]);
  return rowCount ? ok({ archived: true }) : fail("Not found.", 404);
});
