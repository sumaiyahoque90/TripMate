"use client";
import { useState } from "react";
import { Clock, Ticket } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { formatBDT } from "@/lib/utils";

export default function DestinationGrid({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => (
        <article key={a.slug} className="card overflow-hidden">
          <SafeImage src={a.image} alt={a.name} className="h-44 w-full" />
          <div className="p-4">
            <h3 className="text-lg font-bold">{a.name}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-navy/60"><Clock size={13} />{a.duration}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-navy/60"><Ticket size={13} />{a.cost ? `≈ ${formatBDT(a.cost)} per person (demo estimate)` : "Free entry (extras cost more)"}</p>
            {open === a.slug && <p className="mt-3 text-sm text-navy/80">{a.description}</p>}
            <button className="mt-3 text-sm font-semibold text-ocean" aria-expanded={open === a.slug} onClick={() => setOpen(open === a.slug ? null : a.slug)}>{open === a.slug ? "Hide details" : "Explore details"}</button>
          </div>
        </article>))}
    </div>
  );
}
