import { query } from "@/lib/db";
import { ok, fail, readJson, handle } from "@/lib/api";
import { validateFlightSearch } from "@/lib/validations";

// Returns SAMPLE flights from our database (no live airline data).
export const POST = handle(async (req) => {
  const { errors, value } = validateFlightSearch(await readJson(req));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 400, { errors });
  const { rows } = await query(
    `SELECT id, airline, flight_number, origin_code, destination_code, destination_name, departure_time, arrival_time,
            duration_minutes, cabin_class, estimated_price_bdt, is_demo
     FROM flights WHERE is_active AND destination_code=$1 AND cabin_class=$2 ORDER BY estimated_price_bdt`, [value.airport, value.cabin]);
  const flights = rows.map((f) => ({ ...f, estimated_total_bdt: Number(f.estimated_price_bdt) * value.travelers }));
  return ok({ flights, search: value, notice: "Sample data. Prices are estimates until confirmed by our team." });
});
