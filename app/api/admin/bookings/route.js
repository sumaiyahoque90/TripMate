import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, handle } from "@/lib/api";

export const GET = handle(async (req) => {
  const { error } = await requireUser("admin"); if (error) return error;
  const status = new URL(req.url).searchParams.get("status");
  const ok_ = ["pending", "confirmed", "completed", "cancelled"].includes(status);
  const { rows } = await query(
    `SELECT b.id, b.reference, b.type, b.status, b.full_name, b.email, b.phone, b.airport_code, b.departure_date, b.return_date, b.travelers,
            b.estimated_total_bdt, b.discount_bdt, b.special_requests, b.created_at,
            h.name AS hotel_name, hb.room_type, f.airline, f.flight_number, p.name AS package_name, v.code AS voucher_code
     FROM bookings b LEFT JOIN hotel_bookings hb ON hb.booking_id=b.id LEFT JOIN hotels h ON h.id=hb.hotel_id
     LEFT JOIN flight_bookings fb ON fb.booking_id=b.id LEFT JOIN flights f ON f.id=fb.flight_id
     LEFT JOIN travel_packages p ON p.id=b.package_id LEFT JOIN reward_vouchers v ON v.id=hb.voucher_id
     ${ok_ ? "WHERE b.status=$1" : ""} ORDER BY b.created_at DESC LIMIT 300`, ok_ ? [status] : []);
  return ok({ bookings: rows });
});
