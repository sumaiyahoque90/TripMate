import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Check } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import BookingForm from "@/components/booking/BookingForm";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { formatBDT } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const { rows } = await query("SELECT * FROM hotels WHERE id=$1 AND is_active", [id]);
  const h = rows[0]; if (!h) notFound();
  const user = await getCurrentUser();
  const images = [h.image_url, ...(h.gallery || [])].filter(Boolean);
  return (
    <div className="section">
      <Link href="/hotels" className="text-sm font-semibold text-ocean">← All hotels</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="grid grid-cols-3 gap-3">
            <SafeImage src={images[0]} alt={h.name} className="col-span-3 h-72 w-full rounded-2xl sm:h-96" />
            {images.slice(1, 4).map((src, i) => <SafeImage key={i} src={src} alt={`${h.name} photo ${i + 2}`} className="h-24 w-full rounded-xl sm:h-32" />)}
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm"><span className="rounded-full bg-teal-soft px-3 py-1 font-semibold capitalize">{h.category}</span><span className="flex items-center gap-1 text-navy/60"><MapPin size={14} />{h.location}</span></div>
          <h1 className="mt-3 text-4xl font-bold">{h.name}</h1>
          <p className="mt-3 text-navy/80">{h.description}</p>
          <h2 className="mt-8 text-xl font-bold">Facilities</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">{h.facilities.map((f) => <li key={f} className="flex items-center gap-2"><Check size={14} className="text-ocean" />{f}</li>)}</ul>
          <h2 className="mt-8 text-xl font-bold">Rooms & estimated prices</h2>
          <div className="mt-3 divide-y divide-slate-100 rounded-2xl bg-white shadow-card">
            {h.room_types.map((r) => <div key={r.name} className="flex items-center justify-between p-4 text-sm"><span className="font-semibold">{r.name}</span><span>{formatBDT(Number(h.price_per_night_bdt) + Number(r.extra || 0))} / night</span></div>)}
          </div>
          <p className="mt-2 text-xs text-navy/50">Demo estimates for 2 guests per room. Real-time availability is not shown.{h.is_partner ? " This is a demonstration partner hotel for TripMate Rewards, not an actual commercial partnership." : ""}</p>
        </div>
        <div id="book" className="scroll-mt-24">
          <h2 className="mb-3 text-xl font-bold">Request this hotel</h2>
          <BookingForm user={user ? { full_name: user.full_name, email: user.email, phone: user.phone || "" } : null} lockType initial={{ type: "hotel", hotel: String(h.id) }}
            options={{ hotels: [{ id: h.id, name: h.name, price_per_night_bdt: h.price_per_night_bdt, room_types: h.room_types }] }} signInNext={`/hotels/${h.id}`} />
        </div>
      </div>
    </div>
  );
}
