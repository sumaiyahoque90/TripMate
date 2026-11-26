import { query } from "@/lib/db";

export async function GET(req) {
  const dest = new URL(req.url).searchParams.get("airport");
  const args = []; let where = "is_active";
  if (dest === "DXB" || dest === "DWC") { args.push(dest); where += " AND destination_code = $1"; }
  try {
    const { rows } = await query(
      `SELECT id, airline, flight_number, origin_code, destination_code, destination_name, departure_time, arrival_time,
              duration_minutes, cabin_class, estimated_price_bdt, is_demo
       FROM flights WHERE ${where} ORDER BY destination_code, estimated_price_bdt`, args);
    return Response.json({ flights: rows });
  } catch (e) { console.error(e); return Response.json({ error: "Could not load flights." }, { status: 500 }); }
}
