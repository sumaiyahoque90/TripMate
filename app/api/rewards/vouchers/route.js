import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, handle } from "@/lib/api";
import { expireVouchers } from "@/lib/rewards";

export const GET = handle(async () => {
  const { user, error } = await requireUser(); if (error) return error;
  await expireVouchers({ query });
  const { rows } = await query(
    `SELECT v.id, v.code, v.status, v.discount_percent, v.expires_at, v.redeemed_at, h.name AS partner_hotel_name
     FROM reward_vouchers v LEFT JOIN hotels h ON h.id=v.partner_hotel_id WHERE v.user_id=$1 ORDER BY v.created_at DESC`, [user.id]);
  return ok({ vouchers: rows });
});
