import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle } from "@/lib/api";

export const GET = handle(async () => {
  const { error } = await requireUser("admin"); if (error) return error;
  const { rows } = await query("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200");
  return ok({ messages: rows });
});
export const PATCH = handle(async (req) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const { id } = await readJson(req);
  if (!Number.isInteger(Number(id))) return fail("Invalid id.", 400);
  await query("UPDATE contact_messages SET is_read=TRUE WHERE id=$1", [Number(id)]);
  return ok({ ok: true });
});
