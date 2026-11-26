import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Edge gate: redirects unauthenticated users. Real authorization is re-checked
// server-side in every page and route handler (requireUser / getCurrentUser).
export async function proxy(req) {
  const token = req.cookies.get("tripmate_session")?.value;
  const login = new URL("/login", req.url);
  login.searchParams.set("next", req.nextUrl.pathname);
  if (!token) return NextResponse.redirect(login);
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
    if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin")
      return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(login);
  }
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
