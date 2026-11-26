import Link from "next/link";
import { redirect } from "next/navigation";
import StatusBadge from "@/components/ui/StatusBadge";
import RewardProgress from "@/components/rewards/RewardProgress";
import { CancelButton, ReviewForm } from "@/components/dashboard/BookingActions";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { getProgress } from "@/lib/rewards";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "My trips – TripMate" };
export const dynamic = "force-dynamic";
const TYPE = { flight: "Flight", hotel: "Hotel", package: "Package", personalized: "Personalized trip" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "admin") redirect("/admin");
  const [b, plans, progress, reviews] = await Promise.all([
    query(`SELECT b.id, b.reference, b.type, b.status, b.airport_code, b.departure_date, b.return_date, b.travelers, b.estimated_total_bdt, b.discount_bdt, b.created_at,
                  h.name AS hotel_name, p.name AS package_name, f.airline, r.status AS review_status
           FROM bookings b LEFT JOIN hotel_bookings hb ON hb.booking_id=b.id LEFT JOIN hotels h ON h.id=hb.hotel_id
           LEFT JOIN travel_packages p ON p.id=b.package_id LEFT JOIN flight_bookings fb ON fb.booking_id=b.id LEFT JOIN flights f ON f.id=fb.flight_id
           LEFT JOIN reviews r ON r.booking_id=b.id WHERE b.user_id=$1 ORDER BY b.created_at DESC`, [user.id]),
    query("SELECT id, airport_code, departure_date, return_date, travelers, budget_bdt, estimate, booking_id FROM trip_plans WHERE user_id=$1 ORDER BY created_at DESC", [user.id]),
    getProgress({ query }, user.id),
    query("SELECT status, COUNT(*)::int n FROM reviews WHERE user_id=$1 GROUP BY status", [user.id]),
  ]);
  const bookings = b.rows;
  const detail = (x) => x.hotel_name || x.package_name || (x.type === "flight" ? `Dhaka → ${x.airport_code}${x.airline ? ` · ${x.airline}` : " · quotation request"}` : x.type === "personalized" ? `Dhaka → ${x.airport_code}` : "");
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">Welcome, {user.full_name.split(" ")[0]}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section aria-labelledby="bk"><h2 id="bk" className="text-xl font-bold">Booking history & status</h2>
            {bookings.length === 0 ? <div className="card mt-3 p-6 text-sm text-navy/70">No bookings yet. <Link href="/flights" className="font-semibold text-ocean">Search flights</Link> or <Link href="/planner" className="font-semibold text-ocean">plan a trip</Link>.</div> : (
              <ul className="mt-3 space-y-3">{bookings.map((x) => (
                <li key={x.id} className="card flex flex-wrap items-start justify-between gap-3 p-4">
                  <div><p className="font-mono text-sm font-bold text-ocean">{x.reference}</p><p className="font-semibold">{TYPE[x.type]} <span className="font-normal text-navy/60">· {detail(x)}</span></p>
                    <p className="text-xs text-navy/60">{x.departure_date || "Dates TBC"}{x.return_date ? ` → ${x.return_date}` : ""} · {x.travelers} traveler(s)</p>
                    <p className="text-xs text-navy/60">{x.estimated_total_bdt === null ? "Quotation pending" : `Estimated ${formatBDT(x.estimated_total_bdt)}`}{Number(x.discount_bdt) > 0 ? ` (voucher saved ${formatBDT(x.discount_bdt)})` : ""}</p></div>
                  <div className="flex flex-col items-end gap-2"><StatusBadge status={x.status} />
                    {x.status === "pending" && <CancelButton id={x.id} />}
                    {x.status === "completed" && !x.review_status && <ReviewForm bookingId={x.id} reference={x.reference} />}
                    {x.review_status && <span className="text-xs text-navy/60">Review: <StatusBadge status={x.review_status} /></span>}</div>
                </li>))}</ul>)}
          </section>
          <section aria-labelledby="pl"><h2 id="pl" className="text-xl font-bold">Personalized trip plans</h2>
            {plans.rows.length === 0 ? <p className="mt-3 text-sm text-navy/70">No saved plans. <Link href="/planner" className="font-semibold text-ocean">Open the planner</Link>.</p> : (
              <ul className="mt-3 space-y-3">{plans.rows.map((p) => (
                <li key={p.id} className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><div><p className="font-semibold">{p.airport_code} · {p.departure_date} → {p.return_date} · {p.travelers} traveler(s)</p><p className="text-xs text-navy/60">Budget {formatBDT(p.budget_bdt)} · estimate {formatBDT(p.estimate.total)}</p></div>
                  {p.booking_id ? <span className="text-xs text-navy/60">Booked</span> : <Link href={`/book?type=personalized&plan=${p.id}`} className="btn-primary !py-1.5 !text-xs">Book this plan</Link>}</li>))}</ul>)}
          </section>
        </div>
        <aside className="space-y-6">
          <div className="card p-5 text-sm"><p className="text-xs font-semibold text-ocean">Profile</p><p className="mt-1 text-lg font-bold">{user.full_name}</p><p className="text-navy/70">{user.email}</p>{user.phone && <p className="text-navy/70">{user.phone}</p>}</div>
          <RewardProgress progress={progress} />
          <p className="text-xs text-navy/50">Reviews submitted: {reviews.rows.map((r) => `${r.n} ${r.status}`).join(", ") || "none yet"}. You can review a booking once it is marked completed.</p>
        </aside>
      </div>
    </div>
  );
}
