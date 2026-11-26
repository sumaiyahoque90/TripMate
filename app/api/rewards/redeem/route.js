import { withTransaction } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle, intParam, HttpError } from "@/lib/api";
import { checkVoucher, redeemVoucherRow } from "@/lib/rewards";
import { hotelCharge } from "@/lib/pricing";

// Applies a voucher to an existing PENDING hotel booking of the signed-in user (one-time redemption).
export const POST = handle(async (req) => {
  const { user, error } = await requireUser(); if (error) return error;
  const b = await readJson(req);
  const bookingId = intParam(b.booking_id);
  if (!b.code || !bookingId) return fail("Voucher code and booking are required.", 400);
  const result = await withTransaction(async (c) => {
    const bk = (await c.query("SELECT * FROM bookings WHERE id=$1 AND user_id=$2 FOR UPDATE", [bookingId, user.id])).rows[0];
    if (!bk || bk.type !== "hotel") throw new HttpError(404, "Hotel booking not found.");
    if (bk.status !== "pending") throw new HttpError(409, "A voucher can only be applied to a pending booking.");
    const hb = (await c.query("SELECT hb.*, h.price_per_night_bdt, h.room_types FROM hotel_bookings hb JOIN hotels h ON h.id=hb.hotel_id WHERE hb.booking_id=$1", [bookingId])).rows[0];
    if (!hb) throw new HttpError(404, "Hotel booking not found.");
    if (hb.voucher_id) throw new HttpError(409, "A voucher is already applied to this booking.");
    const subtotal = hotelCharge({ hotel: hb, roomType: hb.room_type, nights: hb.nights, travelers: bk.travelers });
    const { voucher, discount } = await checkVoucher(c, { code: b.code, userId: user.id, hotelId: hb.hotel_id, roomType: hb.room_type, hotelSubtotal: subtotal, lock: true });
    await redeemVoucherRow(c, voucher.id);
    await c.query("UPDATE hotel_bookings SET voucher_id=$1 WHERE booking_id=$2", [voucher.id, bookingId]);
    const { rows } = await c.query("UPDATE bookings SET discount_bdt=$1, estimated_total_bdt=$2 WHERE id=$3 RETURNING id, reference, estimated_total_bdt, discount_bdt", [discount, Math.max(subtotal - discount, 0), bookingId]);
    return rows[0];
  });
  return ok({ booking: result });
});
