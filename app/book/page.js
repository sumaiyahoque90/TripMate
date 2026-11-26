import { redirect } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const metadata = { title: "Book – TripMate" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/book?" + new URLSearchParams(sp))}`);
  const [f, h, p, pl] = await Promise.all([
    query("SELECT id, airline, flight_number, destination_code, cabin_class, estimated_price_bdt FROM flights WHERE is_active ORDER BY destination_code, estimated_price_bdt"),
    query("SELECT id, name, price_per_night_bdt, room_types FROM hotels WHERE is_active ORDER BY name"),
    query("SELECT id, name, airport_code, nights, price_per_person_bdt FROM travel_packages WHERE is_active ORDER BY price_per_person_bdt"),
    query("SELECT id, airport_code, departure_date, return_date, travelers, estimate FROM trip_plans WHERE user_id=$1 AND booking_id IS NULL ORDER BY created_at DESC", [user.id]),
  ]);
    const plans = pl.rows.map((r) => ({ ...r, departure_date: r.departure_date, return_date: r.return_date, estimate: { total: r.estimate.total } }));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Booking request</h1>
      <p className="mb-6 mt-1 text-navy/70">Fill in your details. Your request starts as Pending and is confirmed by our team.</p>
      <BookingForm user={{ full_name: user.full_name, email: user.email, phone: user.phone || "" }} initial={sp}
        options={{ flights: f.rows, hotels: h.rows, packages: p.rows, plans }} />
    </div>
  );
}
