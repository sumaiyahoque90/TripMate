import crypto from "crypto";
import { HttpError } from "@/lib/api";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randomPart = (n = 5) => Array.from(crypto.randomBytes(n), (b) => ALPHABET[b % ALPHABET.length]).join("");

export async function expireVouchers(c) {
  await c.query("UPDATE reward_vouchers SET status='expired' WHERE status='active' AND expires_at < NOW()");
}

export async function getSettings(c) {
  const { rows } = await c.query(
    `SELECT rs.partner_hotel_id, rs.reviews_required, rs.discount_percent, rs.voucher_valid_days, rs.eligible_room_types, rs.conditions,
            h.name AS partner_hotel_name, h.location AS partner_hotel_location
     FROM reward_settings rs LEFT JOIN hotels h ON h.id = rs.partner_hotel_id WHERE rs.id = 1`);
  return rows[0] || { partner_hotel_id: null, reviews_required: 3, discount_percent: 20, voucher_valid_days: 180, eligible_room_types: [], conditions: null };
}

// Reward progress for a customer. Only APPROVED reviews count, regardless of rating.
export async function getProgress(c, userId) {
  await expireVouchers(c);
  const settings = await getSettings(c);
  const { rows: reviews } = await c.query(
    "SELECT id, booking_id, rating, title, status, created_at FROM reviews WHERE user_id=$1 ORDER BY created_at", [userId]);
  const { rows: vouchers } = await c.query(
    `SELECT v.id, v.code, v.status, v.discount_percent, v.expires_at, v.redeemed_at, v.created_at, h.name AS partner_hotel_name
     FROM reward_vouchers v LEFT JOIN hotels h ON h.id = v.partner_hotel_id WHERE v.user_id=$1 ORDER BY v.created_at DESC`, [userId]);
  const approved = reviews.filter((r) => r.status === "approved").length;
  const pending = reviews.filter((r) => r.status === "pending").length;
  const required = settings.reviews_required;
  const toward = approved % required; // progress toward the NEXT voucher
  const unlocked = approved >= required;
  const slots = Array.from({ length: required }, (_, i) => {
    const filled = approved >= required && toward === 0 ? required : toward;
    if (i < filled) return { n: i + 1, status: "completed" };
    if (i < filled + pending) return { n: i + 1, status: "awaiting_approval" };
    return { n: i + 1, status: "pending" };
  });
  return { required, approved, pending, completed: approved >= required && toward === 0 ? required : toward, slots, unlocked, vouchers, settings };
}

// Issues vouchers earned but not yet issued. Called inside the approval transaction.
export async function maybeIssueVoucher(client, userId) {
  await client.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [userId]); // serialize per user
  const s = await getSettings(client);
  const { rows: [a] } = await client.query("SELECT COUNT(*)::int n FROM reviews WHERE user_id=$1 AND status='approved'", [userId]);
  const { rows: [v] } = await client.query("SELECT COUNT(*)::int n FROM reward_vouchers WHERE user_id=$1", [userId]);
  const earned = Math.floor(a.n / s.reviews_required);
  const issued = [];
  for (let i = v.n; i < earned; i++) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const code = `TRIPMATE${s.discount_percent}-${randomPart()}`;
      const { rows } = await client.query(
        `INSERT INTO reward_vouchers (code, user_id, partner_hotel_id, discount_percent, expires_at)
         VALUES ($1,$2,$3,$4, NOW() + ($5 || ' days')::interval) ON CONFLICT (code) DO NOTHING RETURNING *`,
        [code, userId, s.partner_hotel_id, s.discount_percent, String(s.voucher_valid_days)]);
      if (rows[0]) { issued.push(rows[0]); break; }
    }
  }
  return issued;
}

// Validates a voucher for a hotel booking and returns the discount. With lock=true the row is locked for redemption.
export async function checkVoucher(c, { code, userId, hotelId, roomType, hotelSubtotal, lock = false }) {
  await expireVouchers(c);
  const { rows } = await c.query(`SELECT * FROM reward_vouchers WHERE code=$1 ${lock ? "FOR UPDATE" : ""}`, [String(code).trim().toUpperCase()]);
  const v = rows[0];
  if (!v || v.user_id !== userId) throw new HttpError(400, "Voucher code not found for your account.");
  if (v.status !== "active") throw new HttpError(400, `This voucher is ${v.status}.`);
  const s = await getSettings(c);
  if (!v.partner_hotel_id || v.partner_hotel_id !== hotelId)
    throw new HttpError(400, `This voucher is only valid at ${s.partner_hotel_name || "the partner hotel"}.`);
  if (s.eligible_room_types?.length && !s.eligible_room_types.includes(roomType))
    throw new HttpError(400, `This voucher applies to: ${s.eligible_room_types.join(", ")}.`);
  const discount = Math.round((Number(hotelSubtotal) * v.discount_percent) / 100);
  return { voucher: v, discount };
}

export async function redeemVoucherRow(client, voucherId) {
  const { rowCount } = await client.query(
    "UPDATE reward_vouchers SET status='redeemed', redeemed_at=NOW() WHERE id=$1 AND status='active'", [voucherId]);
  if (!rowCount) throw new HttpError(409, "This voucher has already been used.");
}
