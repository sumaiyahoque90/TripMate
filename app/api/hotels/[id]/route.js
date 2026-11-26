import { query } from "@/lib/db";
import { ok, fail, handle, intParam } from "@/lib/api";

export const GET = handle(async (_req, { params }) => {
  const id = intParam((await params).id); if (!id) return fail("Invalid hotel id.", 400);
  const { rows } = await query(
    `SELECT id,name,location,category,price_per_night_bdt,facilities,description,image_url,gallery,room_types,is_partner,is_demo
     FROM hotels WHERE id=$1 AND is_active`, [id]);
  return rows[0] ? ok({ hotel: rows[0] }) : fail("Hotel not found.", 404);
});
