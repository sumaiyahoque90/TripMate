import { query } from "@/lib/db";

export async function loadPlannerData() {
  const [f, h, p] = await Promise.all([
    query("SELECT destination_code, cabin_class, estimated_price_bdt FROM flights WHERE is_active"),
    query("SELECT id,name,location,category,price_per_night_bdt,facilities,image_url FROM hotels WHERE is_active AND NOT is_partner"),
    query("SELECT id,name,description,nights,airport_code,price_per_person_bdt,image_url FROM travel_packages WHERE is_active"),
  ]);
  return { flights: f.rows, hotels: h.rows, packages: p.rows };
}
