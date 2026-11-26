import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

const COOKIE = "tripmate_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET is missing or too short");
  return new TextEncoder().encode(s);
}

export const hashPassword = (pw) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);

export async function createSession(user) {
  const token = await new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

// Returns the fresh user row (role read from DB, not trusted from the token) or null.
export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const { rows } = await query(
      "SELECT id, full_name, email, phone, role FROM users WHERE id = $1",
      [Number(payload.sub)]
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

// For route handlers: returns { user } or { error: Response }.
export async function requireUser(role) {
  const user = await getCurrentUser();
  if (!user) return { error: Response.json({ error: "Please sign in." }, { status: 401 }) };
  if (role && user.role !== role)
    return { error: Response.json({ error: "You do not have access to this resource." }, { status: 403 }) };
  return { user };
}
