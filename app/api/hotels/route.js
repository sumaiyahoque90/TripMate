import { query } from "@/lib/db";

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const where = ["is_active"];
  const args = [];
  const add = (sql, v) => { args.push(v); where.push(sql.replace("?", `$${args.length}`)); };
  const cat = p.get("category");
  if (["budget", "standard", "premium", "luxury"].includes(cat)) add("category = ?", cat);
  const min = Number(p.get("minPrice")); const max = Number(p.get("maxPrice"));
  if (min > 0) add("price_per_night_bdt >= ?", min);
  if (max > 0) add("price_per_night_bdt <= ?", max);
  if (p.get("location")) add("location ILIKE ?", `%${p.get("location").slice(0, 60)}%`);
  if (p.get("facility")) add("? = ANY(facilities)", p.get("facility").slice(0, 60));
  try {
    const { rows } = await query(
      `SELECT id, name, location, category, price_per_night_bdt, facilities, description, image_url, is_partner, is_demo
       FROM hotels WHERE ${where.join(" AND ")} ORDER BY price_per_night_bdt`, args);
    return Response.json({ hotels: rows });
  } catch (e) { console.error(e); return Response.json({ error: "Could not load hotels." }, { status: 500 }); }
}
