import { withTransaction } from "@/lib/db";
import { HttpError } from "@/lib/api";
import { bookingReference } from "@/lib/utils";
import { nightsBetween, computeBookingTotal } from "@/lib/pricing";
import { checkVoucher, redeemVoucherRow } from "@/lib/rewards";

// Creates a booking + type-specific child row atomically. Totals and discounts are computed server-side.
export async function createBooking(user, v) {
  return withTransaction(async (c) => {
    let flight = null, hotel = null, pkg = null, plan = null;
    let airport = v.airport_code, depDate = v.departure_date, retDate = v.return_date, travelers = v.travelers;

    if (v.flight_id) {
      flight = (await c.query("SELECT * FROM flights WHERE id=$1 AND is_active", [v.flight_id])).rows[0];
      if (!flight) throw new HttpError(404, "Selected flight is no longer available.");
      if (airport && airport !== flight.destination_code) throw new HttpError(400, "Selected flight does not match the chosen airport.");
      airport = flight.destination_code;
    }
    if (v.type === "hotel") {
      hotel = (await c.query("SELECT * FROM hotels WHERE id=$1 AND is_active", [v.hotel_id])).rows[0];
      if (!hotel) throw new HttpError(404, "Selected hotel is not available.");
    }
    if (v.type === "package") {
      pkg = (await c.query("SELECT * FROM travel_packages WHERE id=$1 AND is_active", [v.package_id])).rows[0];
      if (!pkg) throw new HttpError(404, "Selected package is not available.");
      airport = pkg.airport_code;
    }
    if (v.type === "personalized") {
      plan = (await c.query("SELECT * FROM trip_plans WHERE id=$1 AND user_id=$2 FOR UPDATE", [v.trip_plan_id, user.id])).rows[0];
      if (!plan) throw new HttpError(404, "Trip plan not found.");
      if (plan.booking_id) throw new HttpError(409, "This trip plan has already been booked.");
      airport = plan.airport_code; depDate = String(plan.departure_date);
      retDate = String(plan.return_date); travelers = plan.travelers;
    }

    const nights = nightsBetween(depDate, retDate);
    if (v.type === "hotel" && !nights) throw new HttpError(400, "Choose check-out after check-in.", { errors: { return_date: "Choose at least one night." } });
    if (v.type === "hotel" && hotel?.room_types?.length && !hotel.room_types.some((r) => r.name === v.room_type))
      throw new HttpError(400, "Choose a valid room type.", { errors: { room_type: "Choose a room type." } });

    const { total, hotelSubtotal } = computeBookingTotal({
      type: v.type, flight, hotel, pkg, planTotal: plan ? Number(plan.estimate.total) : null, travelers, nights, roomType: v.room_type });

    let discount = 0, voucher = null;
    if (v.voucher_code) {
      const r = await checkVoucher(c, { code: v.voucher_code, userId: user.id, hotelId: hotel.id, roomType: v.room_type, hotelSubtotal, lock: true });
      voucher = r.voucher; discount = r.discount;
      await redeemVoucherRow(c, voucher.id); // one-time redemption, same transaction as the booking
    }

    let booking = null;
    for (let i = 0; i < 8 && !booking; i++) {
      const { rows } = await c.query(
        `INSERT INTO bookings (reference, user_id, type, full_name, email, phone, airport_code, departure_date, return_date, travelers,
                               estimated_total_bdt, discount_bdt, special_requests, package_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT (reference) DO NOTHING RETURNING *`,
        [bookingReference(), user.id, v.type, v.full_name, v.email, v.phone, airport, depDate, retDate, travelers,
         total === null ? null : Math.max(total - discount, 0), discount, v.special_requests, pkg?.id || null]);
      booking = rows[0];
    }
    if (!booking) throw new HttpError(500, "Could not generate a booking reference. Try again.");

    if (v.type === "flight") {
      const pax = v.passengers.length ? v.passengers : [{ full_name: v.full_name }];
      await c.query("INSERT INTO flight_bookings (booking_id, flight_id, cabin_class, passengers) VALUES ($1,$2,$3,$4)",
        [booking.id, flight?.id || null, v.cabin_class, JSON.stringify(pax)]);
    } else if (v.type === "hotel") {
      await c.query("INSERT INTO hotel_bookings (booking_id, hotel_id, room_type, nights, voucher_id) VALUES ($1,$2,$3,$4,$5)",
        [booking.id, hotel.id, v.room_type, nights, voucher?.id || null]);
    } else if (v.type === "personalized") {
      await c.query("UPDATE trip_plans SET booking_id=$1 WHERE id=$2", [booking.id, plan.id]);
    }
    return booking;
  });
}

export const NEXT_STATUS = { pending: ["confirmed", "cancelled"], confirmed: ["completed", "cancelled"], completed: [], cancelled: [] };
