import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle } from "@/lib/api";
import { validateBooking } from "@/lib/validations";
import { createBooking } from "@/lib/bookings";

export const POST = handle(async (req) => {
  const { user, error } = await requireUser(); if (error) return error;
  const { errors, value } = validateBooking({ ...(await readJson(req)), type: "hotel" });
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  return ok({ booking: await createBooking(user, value) }, 201);
});
