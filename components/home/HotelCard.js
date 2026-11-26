import Link from "next/link";
import { MapPin } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { formatBDT } from "@/lib/utils";

export default function HotelCard({ h, withBook = false }) {
  return (
    <article className="card overflow-hidden">
      <SafeImage src={h.image_url} alt={h.name} className="h-44 w-full" />
      <div className="p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-teal-soft px-2.5 py-0.5 font-semibold capitalize">{h.category}</span>
          <span className="flex items-center gap-1 text-navy/60"><MapPin size={12} />{h.location}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold">{h.name}</h3>
        <p className="mt-1 text-xs text-navy/60">{h.facilities.slice(0, 4).join(" · ")}</p>
        {h.is_partner && <p className="mt-1 text-xs font-semibold text-ocean">Rewards partner hotel (demo)</p>}
        <div className="mt-4 flex items-end justify-between">
          <p><span className="text-lg font-bold text-ocean">{formatBDT(h.price_per_night_bdt)}</span><span className="text-xs text-navy/60"> / night (demo estimate)</span></p>
          <div className="flex items-center gap-3"><Link href={`/hotels/${h.id}`} className="text-sm font-semibold text-ocean hover:underline">View details</Link>{withBook && <Link href={`/hotels/${h.id}#book`} className="btn-primary !px-3 !py-1.5 !text-xs">Book Hotel</Link>}</div>
        </div>
      </div>
    </article>
  );
}
