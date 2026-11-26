import Link from "next/link";
import { Plane, Hotel, Wallet, Gift } from "lucide-react";
import Hero from "@/components/home/Hero";
import HotelCard from "@/components/home/HotelCard";
import SafeImage from "@/components/ui/SafeImage";
import { query } from "@/lib/db";
import { formatBDT } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function load() {
  try {
    const [h, p, r] = await Promise.all([
      query("SELECT id,name,location,category,price_per_night_bdt,facilities,image_url FROM hotels WHERE is_active AND NOT is_partner ORDER BY price_per_night_bdt DESC LIMIT 3"),
      query("SELECT id,name,description,nights,airport_code,price_per_person_bdt,image_url FROM travel_packages WHERE is_active ORDER BY price_per_person_bdt LIMIT 3"),
      query("SELECT r.rating,r.title,r.comment,u.full_name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.status='approved' ORDER BY r.reviewed_at DESC LIMIT 3"),
    ]);
    return { hotels: h.rows, packages: p.rows, reviews: r.rows, dbOk: true };
  } catch { return { hotels: [], packages: [], reviews: [], dbOk: false }; }
}

const FAQ = [
  ["Is the price I see final?", "No. Prices are estimates until our team confirms your request. Demo data is labeled."],
  ["When is my ticket issued?", "Only after an administrator confirms your booking. A pending request is not a ticket."],
  ["Do you take payments online?", "Not in this version. We confirm details with you first."],
  ["How do I get the 20% voucher?", "Complete bookings, submit three genuine reviews, and once an admin approves all three, your voucher is generated."],
];

export default async function Home() {
  const { hotels, packages, reviews, dbOk } = await load();
  return (
    <>
      <Hero />
      <section className="section pt-28">
        <h2 className="text-3xl font-bold">Everything for Dubai, in one place</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[[Plane,"Two airports","Compare DXB and DWC from Dhaka.","/flights"],[Hotel,"Hotels for every budget","Budget to luxury, filtered your way.","/hotels"],[Wallet,"Budget trip planner","Enter your BDT budget, get a costed plan.","/planner"],[Gift,"Review & Save 20%","Three approved reviews unlock a hotel voucher.","/rewards"]].map(([I,t,d,h]) => (
            <Link key={t} href={h} className="card p-5 transition-shadow hover:shadow-lg">
              <I className="text-ocean" /><h3 className="mt-3 text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-navy/70">{d}</p>
            </Link>))}
        </div>
      </section>

      {!dbOk && <p className="mx-auto max-w-6xl px-4 text-sm text-amber-700 sm:px-6">Database not connected yet. Set DATABASE_URL and run <code>npm run db:setup</code> to see hotels and packages here.</p>}

      {hotels.length > 0 && (
        <section className="section pt-0">
          <div className="flex items-end justify-between"><h2 className="text-3xl font-bold">Featured hotels</h2><Link href="/hotels" className="text-sm font-semibold text-ocean">See all hotels</Link></div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">{hotels.map((h) => <HotelCard key={h.id} h={h} />)}</div>
        </section>)}

      {packages.length > 0 && (
        <section className="bg-teal-soft"><div className="section">
          <h2 className="text-3xl font-bold">Recommended packages</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">{packages.map((p) => (
            <article key={p.id} className="card overflow-hidden">
              <SafeImage src={p.image_url} alt={p.name} className="h-40 w-full" />
              <div className="p-4"><h3 className="font-bold">{p.name}</h3><p className="mt-1 text-sm text-navy/70">{p.description}</p>
                <p className="mt-3 text-sm">From <span className="font-bold text-ocean">{formatBDT(p.price_per_person_bdt)}</span> per person · {p.nights} nights · via {p.airport_code}</p></div>
            </article>))}</div>
        </div></section>)}

      <section className="section">
        <h2 className="text-3xl font-bold">Traveler reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 max-w-xl text-navy/70">No approved reviews yet. Every review here comes from a completed TripMate booking and is approved by our team before it appears.</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-3">{reviews.map((r, i) => (
            <figure key={i} className="card p-5"><p className="text-sm text-amber-500">{"★".repeat(r.rating)}</p>
              <blockquote className="mt-2 text-sm">{r.comment}</blockquote><figcaption className="mt-3 text-xs font-semibold text-navy/60">{r.full_name}</figcaption></figure>))}</div>)}
      </section>

      <section className="section pt-0">
        <h2 className="text-3xl font-bold">Questions, answered</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl bg-white shadow-card">
          {FAQ.map(([q, a]) => (<details key={q} className="group p-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-sm text-navy/70">{a}</p></details>))}
        </div>
      </section>
    </>
  );
}
