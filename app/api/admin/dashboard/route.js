import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, handle } from "@/lib/api";
import { expireVouchers } from "@/lib/rewards";

export const GET = handle(async () => {
  const { error } = await requireUser("admin"); if (error) return error;
  await expireVouchers({ query });
  const [u, b, r, v, m] = await Promise.all([
    query("SELECT COUNT(*)::int AS customers FROM users WHERE role='customer'"),
    query(`SELECT COUNT(*) FILTER (WHERE type='flight')::int AS flight_bookings, COUNT(*) FILTER (WHERE type='hotel')::int AS hotel_bookings,
                  COUNT(*) FILTER (WHERE type IN ('package','personalized'))::int AS trip_bookings,
                  COUNT(*) FILTER (WHERE status='pending')::int AS pending, COUNT(*) FILTER (WHERE status='confirmed')::int AS confirmed,
                  COUNT(*) FILTER (WHERE status='completed')::int AS completed, COUNT(*) FILTER (WHERE status='cancelled')::int AS cancelled,
                  COUNT(*)::int AS total FROM bookings`),
    query("SELECT COUNT(*)::int AS total_reviews, COUNT(*) FILTER (WHERE status='pending')::int AS pending_reviews FROM reviews"),
    query(`SELECT COUNT(*)::int AS vouchers, COUNT(*) FILTER (WHERE status='active')::int AS active,
                  COUNT(*) FILTER (WHERE status='redeemed')::int AS redeemed, COUNT(*) FILTER (WHERE status='expired')::int AS expired FROM reward_vouchers`),
    query("SELECT COUNT(*)::int AS unread_messages FROM contact_messages WHERE NOT is_read"),
  ]);
  return ok({ stats: { ...u.rows[0], ...b.rows[0], ...r.rows[0], ...v.rows[0], ...m.rows[0] } });
});
