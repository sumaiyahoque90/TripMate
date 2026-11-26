"use client";
import { useEffect, useRef, useState } from "react";
import HotelCard from "@/components/home/HotelCard";

const FACILITIES = ["Free WiFi", "Breakfast", "Pool", "Gym", "Spa", "Private beach", "Airport shuttle"];

export default function HotelExplorer({ initialHotels }) {
  const [f, setF] = useState({ category: "", minPrice: "", maxPrice: "", location: "", facility: "" });
  const [hotels, setHotels] = useState(initialHotels);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const first = useRef(true);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(async () => {
      setBusy(true); setErr("");
      const p = new URLSearchParams(Object.entries(f).filter(([, v]) => v));
      const r = await fetch(`/api/hotels?${p}`);
      const d = await r.json().catch(() => ({}));
      setBusy(false);
      if (!r.ok) return setErr(d.error || "Could not load hotels.");
      setHotels(d.hotels);
    }, 250);
    return () => clearTimeout(t);
  }, [f]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="card h-fit space-y-4 p-5" aria-label="Filters">
        <div><label className="label" htmlFor="hc">Category</label>
          <select id="hc" className="field" value={f.category} onChange={set("category")}><option value="">All</option><option value="budget">Budget</option><option value="standard">Standard</option><option value="premium">Premium</option><option value="luxury">Luxury</option></select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="hmin">Min ৳/night</label><input id="hmin" type="number" min="0" className="field" value={f.minPrice} onChange={set("minPrice")} /></div>
          <div><label className="label" htmlFor="hmax">Max ৳/night</label><input id="hmax" type="number" min="0" className="field" value={f.maxPrice} onChange={set("maxPrice")} /></div></div>
        <div><label className="label" htmlFor="hl">Location</label><input id="hl" className="field" placeholder="e.g. Marina" value={f.location} onChange={set("location")} /></div>
        <div><label className="label" htmlFor="hf">Facility</label>
          <select id="hf" className="field" value={f.facility} onChange={set("facility")}><option value="">Any</option>{FACILITIES.map((x) => <option key={x}>{x}</option>)}</select></div>
        <button type="button" className="text-sm font-semibold text-ocean" onClick={() => setF({ category: "", minPrice: "", maxPrice: "", location: "", facility: "" })}>Clear filters</button>
      </aside>
      <div aria-live="polite">
        {err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
        <p className="mb-3 text-sm text-navy/60">{busy ? "Updating…" : `${hotels.length} hotel${hotels.length === 1 ? "" : "s"}`} · prices are demo estimates, availability is not live</p>
        {hotels.length === 0 ? <div className="card p-6 text-navy/70">No hotels match these filters. Try widening the price range.</div>
          : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{hotels.map((h) => <HotelCard key={h.id} h={h} withBook />)}</div>}
      </div>
    </div>
  );
}
