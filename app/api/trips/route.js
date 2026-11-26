import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle } from "@/lib/api";
import { validateTripInput } from "@/lib/validations";
import { estimateTrip } from "@/lib/planner";
import { loadPlannerData } from "@/lib/plannerData";

export const POST = handle(async (req) => {
  const { user, error } = await requireUser(); if (error) return error;
  const { errors, value } = validateTripInput(await readJson(req));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  const estimate = estimateTrip(value, await loadPlannerData());
  const { rows } = await query(
    `INSERT INTO trip_plans (user_id, airport_code, departure_date, return_date, travelers, budget_bdt, hotel_category, activities, preferences, estimate, itinerary)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [user.id, value.airport_code, value.departure_date, value.return_date, value.travelers, value.budget_bdt, value.hotel_category,
     value.activities, value.preferences, JSON.stringify(estimate), JSON.stringify(estimate.itinerary)]);
  return ok({ plan_id: rows[0].id, estimate }, 201);
});

export const GET = handle(async () => {
  const { user, error } = await requireUser(); if (error) return error;
  const { rows } = await query("SELECT id, airport_code, departure_date, return_date, travelers, budget_bdt, hotel_category, estimate, booking_id, created_at FROM trip_plans WHERE user_id=$1 ORDER BY created_at DESC", [user.id]);
  return ok({ plans: rows });
});
