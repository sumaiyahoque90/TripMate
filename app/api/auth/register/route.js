import { query } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { validateRegister } from "@/lib/validations";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const { errors, value } = validateRegister(body || {});
  if (Object.keys(errors).length) return Response.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 });
  try {
    const { rows } = await query(
      `INSERT INTO users (full_name, email, phone, password_hash) VALUES ($1,$2,$3,$4)
       RETURNING id, full_name, email, role`,
      [value.full_name, value.email, value.phone, await hashPassword(value.password)]
    );
    await createSession(rows[0]);
    return Response.json({ user: rows[0] }, { status: 201 });
  } catch (e) {
    if (e.code === "23505") return Response.json({ error: "An account with this email already exists.", errors: { email: "Already registered." } }, { status: 409 });
    console.error(e);
    return Response.json({ error: "Could not create your account. Try again." }, { status: 500 });
  }
}
