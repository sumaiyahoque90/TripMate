import { withTransaction } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle, intParam, HttpError } from "@/lib/api";
import { NEXT_STATUS } from "@/lib/bookings";

export const PATCH = handle(async (req, { params }) => {
  const { user, error } = await requireUser(); if (error) return error;
  const id = intParam((await params).id); if (!id) return fail("Invalid booking id.", 400);
  const { status } = await readJson(req);
  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) return fail("Invalid status.", 400);

  const booking = await withTransaction(async (c) => {
    const b = (await c.query("SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [id])).rows[0];
    if (!b || (b.user_id !== user.id && user.role !== "admin")) throw new HttpError(404, "Booking not found.");
    if (user.role !== "admin" && !(b.status === "pending" && status === "cancelled"))
      throw new HttpError(403, "You can only cancel a pending booking.");
    if (!NEXT_STATUS[b.status].includes(status)) throw new HttpError(409, `Cannot change a ${b.status} booking to ${status}.`);
    const { rows } = await c.query("UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
    if (status === "cancelled") {
      // Give the voucher back (if still valid) when a voucher-backed hotel booking is cancelled.
      const hb = (await c.query("SELECT voucher_id FROM hotel_bookings WHERE booking_id=$1", [id])).rows[0];
      if (hb?.voucher_id) {
        await c.query(
          `UPDATE reward_vouchers SET status = CASE WHEN expires_at > NOW() THEN 'active'::voucher_status ELSE 'expired'::voucher_status END, redeemed_at=NULL WHERE id=$1`,
          [hb.voucher_id]);
        await c.query("UPDATE hotel_bookings SET voucher_id=NULL WHERE booking_id=$1", [id]);
      }
    }
    return rows[0];
  });
  return ok({ booking });
});
