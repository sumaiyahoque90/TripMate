import { query, withTransaction } from "@/lib/db";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle, HttpError } from "@/lib/api";
import { validateReview } from "@/lib/validations";

// Review for a COMPLETED booking owned by the user. One review per booking (UNIQUE constraint).
export const POST = handle(async (req) => {
  const { user, error } = await requireUser(); if (error) return error;
  const { errors, value } = validateReview(await readJson(req));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  const review = await withTransaction(async (c) => {
    const b = (await c.query("SELECT id, user_id, status FROM bookings WHERE id=$1 FOR UPDATE", [value.booking_id])).rows[0];
    if (!b || b.user_id !== user.id) throw new HttpError(404, "Booking not found.");
    if (b.status !== "completed") throw new HttpError(409, "You can review a booking only after it is marked completed.");
    try {
      return (await c.query(
        "INSERT INTO reviews (user_id, booking_id, rating, title, comment) VALUES ($1,$2,$3,$4,$5) RETURNING id, booking_id, rating, status",
        [user.id, b.id, value.rating, value.title, value.comment])).rows[0];
    } catch (e) {
      if (e.code === "23505") throw new HttpError(409, "You have already reviewed this booking.");
      throw e;
    }
  });
  return ok({ review }, 201);
});

// Public: approved reviews only, with first name + last initial. ?mine=1 returns the signed-in user's own reviews.
export const GET = handle(async (req) => {
  if (new URL(req.url).searchParams.get("mine")) {
    const user = await getCurrentUser(); if (!user) return fail("Please sign in.", 401);
    const { rows } = await query("SELECT id, booking_id, rating, title, comment, status, created_at FROM reviews WHERE user_id=$1 ORDER BY created_at DESC", [user.id]);
    return ok({ reviews: rows });
  }
  const { rows } = await query(
    `SELECT r.id, r.rating, r.title, r.comment, r.reviewed_at,
            split_part(u.full_name,' ',1) || COALESCE(' ' || NULLIF(left(split_part(u.full_name,' ',2),1),'') || '.', '') AS author
     FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.status='approved' ORDER BY r.reviewed_at DESC LIMIT 50`);
  return ok({ reviews: rows });
});
