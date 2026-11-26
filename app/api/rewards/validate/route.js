import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle, intParam } from "@/lib/api";
import { checkVoucher } from "@/lib/rewards";
import { nightsBetween, hotelCharge } from "@/lib/pricing";

// Preview only: validates the code against a hotel selection and returns the discount. Does not redeem.
export const POST = handle(async (req) => {
  const { user, error } = await requireUser(); if (error) return error;
  const b = await readJson(req);
  const hotelId = intParam(b.hotel_id);
  if (!b.code || !hotelId) return fail("Enter a voucher code and choose a hotel.", 400);
  const hotel = (await query("SELECT * FROM hotels WHERE id=$1 AND is_active", [hotelId])).rows[0];
  if (!hotel) return fail("Hotel not found.", 404);
  const nights = nightsBetween(b.departure_date, b.return_date);
  const travelers = intParam(b.travelers) || 1;
  const subtotal = hotelCharge({ hotel, roomType: b.room_type, nights, travelers });
  const { voucher, discount } = await checkVoucher({ query }, { code: b.code, userId: user.id, hotelId, roomType: b.room_type, hotelSubtotal: subtotal });
  return ok({ valid: true, code: voucher.code, discount_percent: voucher.discount_percent, discount_bdt: discount, hotel_subtotal_bdt: subtotal, expires_at: voucher.expires_at });
});
