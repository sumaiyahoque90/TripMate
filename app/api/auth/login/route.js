import { query } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { validateLogin } from "@/lib/validations";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const { errors, value } = validateLogin(body || {});
  if (Object.keys(errors).length) return Response.json({ error: "Enter your email and password.", errors }, { status: 400 });
  try {
    const { rows } = await query("SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1", [value.email]);
    const u = rows[0];
    if (!u || !(await verifyPassword(value.password, u.password_hash)))
      return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
    await createSession(u);
    return Response.json({ user: { id: u.id, full_name: u.full_name, email: u.email, role: u.role } });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not sign you in. Try again." }, { status: 500 });
  }
}
