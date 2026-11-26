import { loadPlannerData } from "@/lib/plannerData";
import { ok, fail, readJson, handle } from "@/lib/api";
import { validateTripInput } from "@/lib/validations";
import { estimateTrip } from "@/lib/planner";

export const POST = handle(async (req) => {
  const { errors, value } = validateTripInput(await readJson(req));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  return ok({ estimate: estimateTrip(value, await loadPlannerData()), note: "Estimates use configurable demo prices, not live pricing." });
});
