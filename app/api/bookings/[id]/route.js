import { query } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, handle, intParam } from "@/lib/api";

export const GET = handle(async (_req, { params }) => {
  const { user, error } = await requireUser(); if (error) return error;
  const id = intParam((await params).id); if (!id) return fail("Invalid booking id.", 400);
  const { rows } = await query(
    `SELECT b.*, fb.cabin_class, fb.passengers, f.airline, f.flight_number, f.departure_time, f.arrival_time,
            hb.room_type, hb.nights, h.name AS hotel_name, h.location AS hotel_location, v.code AS voucher_code, p.name AS package_name
     FROM bookings b
     LEFT JOIN flight_bookings fb ON fb.booking_id=b.id LEFT JOIN flights f ON f.id=fb.flight_id
     LEFT JOIN hotel_bookings hb ON hb.booking_id=b.id LEFT JOIN hotels h ON h.id=hb.hotel_id
     LEFT JOIN reward_vouchers v ON v.id=hb.voucher_id LEFT JOIN travel_packages p ON p.id=b.package_id
     WHERE b.id=$1`, [id]);
  const b = rows[0];
  if (!b || (b.user_id !== user.id && user.role !== "admin")) return fail("Booking not found.", 404); // no existence leak
  return ok({ booking: b });
});
