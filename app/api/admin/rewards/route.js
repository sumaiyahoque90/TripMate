import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, readJson, handle } from "@/lib/api";
import { expireVouchers, getSettings } from "@/lib/rewards";

export const GET = handle(async () => {
  const { error } = await requireUser("admin"); if (error) return error;
  await expireVouchers({ query });
  const [vouchers, hotels] = await Promise.all([
    query(`SELECT v.id, v.code, v.status, v.discount_percent, v.expires_at, v.redeemed_at, v.created_at, u.full_name, u.email, h.name AS partner_hotel_name
           FROM reward_vouchers v JOIN users u ON u.id=v.user_id LEFT JOIN hotels h ON h.id=v.partner_hotel_id ORDER BY v.created_at DESC LIMIT 300`),
    query("SELECT id, name, location FROM hotels WHERE is_active ORDER BY name"),
  ]);
  return ok({ settings: await getSettings({ query }), vouchers: vouchers.rows, hotels: hotels.rows });
});

// Update program configuration.
export const PUT = handle(async (req) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const b = await readJson(req);
  const req_ = Number(b.reviews_required), pct = Number(b.discount_percent), days = Number(b.voucher_valid_days);
  if (!Number.isInteger(req_) || req_ < 1 || req_ > 20) return fail("Reviews required must be 1 to 20.", 400);
  if (!Number.isInteger(pct) || pct < 1 || pct > 100) return fail("Discount must be 1 to 100%.", 400);
  if (!Number.isInteger(days) || days < 1 || days > 3650) return fail("Validity must be 1 to 3650 days.", 400);
  const hotelId = b.partner_hotel_id ? Number(b.partner_hotel_id) : null;
  const rooms = (Array.isArray(b.eligible_room_types) ? b.eligible_room_types : String(b.eligible_room_types || "").split(",")).map((s) => String(s).trim()).filter(Boolean);
  await query(
    `INSERT INTO reward_settings (id, partner_hotel_id, reviews_required, discount_percent, voucher_valid_days, eligible_room_types, conditions)
     VALUES (1,$1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO UPDATE SET partner_hotel_id=$1, reviews_required=$2, discount_percent=$3, voucher_valid_days=$4, eligible_room_types=$5, conditions=$6`,
    [hotelId, req_, pct, days, rooms, String(b.conditions || "").slice(0, 1000) || null]);
  return ok({ settings: await getSettings({ query }) });
});

// Expire an active voucher manually.
export const PATCH = handle(async (req) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const b = await readJson(req);
  if (b.action !== "expire" || !Number.isInteger(Number(b.voucher_id))) return fail("Invalid request.", 400);
  const { rowCount } = await query("UPDATE reward_vouchers SET status='expired' WHERE id=$1 AND status='active'", [Number(b.voucher_id)]);
  return rowCount ? ok({ expired: true }) : fail("Only active vouchers can be expired.", 409);
});
