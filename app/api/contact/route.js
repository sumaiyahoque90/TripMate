import { query } from "@/lib/db";
import { ok, fail, readJson, handle } from "@/lib/api";
import { validateContact } from "@/lib/validations";

export const POST = handle(async (req) => {
  const { errors, value } = validateContact(await readJson(req));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  await query("INSERT INTO contact_messages (name,email,subject,message) VALUES ($1,$2,$3,$4)", [value.name, value.email, value.subject, value.message]);
  return ok({ ok: true }, 201);
});
