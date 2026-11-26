import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, handle } from "@/lib/api";

export const GET = handle(async (req) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const status = new URL(req.url).searchParams.get("status");
  const ok_ = ["pending", "approved", "rejected"].includes(status);
  const { rows } = await query(
    `SELECT r.id, r.rating, r.title, r.comment, r.status, r.created_at, u.full_name, u.email, b.reference, b.type AS booking_type
     FROM reviews r JOIN users u ON u.id=r.user_id JOIN bookings b ON b.id=r.booking_id
     ${ok_ ? "WHERE r.status=$1" : ""} ORDER BY (r.status='pending') DESC, r.created_at DESC LIMIT 300`, ok_ ? [status] : []);
  return ok({ reviews: rows });
});
