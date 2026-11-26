import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle } from "@/lib/api";
import { validateBooking } from "@/lib/validations";
import { createBooking } from "@/lib/bookings";

export const POST = handle(async (req) => {
  const { user, error } = await requireUser(); if (error) return error;
  const { errors, value } = validateBooking(await readJson(req));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  return ok({ booking: await createBooking(user, value) }, 201);
});

export const GET = handle(async () => {
  const { user, error } = await requireUser(); if (error) return error;
  const { rows } = await query(
    `SELECT b.id, b.reference, b.type, b.status, b.airport_code, b.departure_date, b.return_date, b.travelers, b.estimated_total_bdt, b.discount_bdt, b.created_at,
            (SELECT r.status FROM reviews r WHERE r.booking_id=b.id) AS review_status
     FROM bookings b WHERE b.user_id=$1 ORDER BY b.created_at DESC`, [user.id]);
  return ok({ bookings: rows });
});
