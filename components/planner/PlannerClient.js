"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calculator } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import SafeImage from "@/components/ui/SafeImage";
import { ATTRACTIONS } from "@/lib/dubai";
import { formatBDT } from "@/lib/utils";

const LABELS = { flights: "Return flights", hotel: "Hotel", food: "Food", transport: "Local transport", attractions: "Attractions & activities", misc: "Additional expenses" };

export default function PlannerClient() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ airport_code: "DXB", departure_date: "", return_date: "", travelers: 2, budget_bdt: 250000, hotel_category: "standard", activities: ["burj-khalifa", "desert-safari"], preferences: "" });
  const [est, setEst] = useState(null);
  const [errs, setErrs] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (s) => setF({ ...f, activities: f.activities.includes(s) ? f.activities.filter((x) => x !== s) : [...f.activities, s] });
  const body = () => ({ ...f, travelers: Number(f.travelers), budget_bdt: Number(f.budget_bdt) });
  const post = (url) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body()) });

  async function calc(e) {
    e?.preventDefault(); setBusy(true); setMsg(""); setErrs({});
    const r = await post("/api/trips/estimate"); const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErrs(d.errors || {}); setMsg(d.error || "Could not calculate."); return; }
    setEst(d.estimate);
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  }
  async function bookIt() {
    setBusy(true); setMsg("");
    const r = await post("/api/trips"); const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.status === 401) return router.push("/login?next=/planner");
    if (!r.ok) return setMsg(d.error || "Could not save your plan.");
    router.push(`/book?type=personalized&plan=${d.plan_id}`);
  }
  const Err = ({ k }) => (errs[k] ? <p className="mt-1 text-xs text-red-600">{errs[k]}</p> : null);
  const maxB = est ? Math.max(...Object.values(est.breakdown)) : 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      <form onSubmit={calc} className="card h-fit space-y-4 p-5" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">From</label><input className="field bg-slate-50" value="Dhaka" disabled /></div>
          <div><label className="label">To</label><input className="field bg-slate-50" value="Dubai" disabled /></div></div>
        <div><label className="label" htmlFor="pa">Airport</label><select id="pa" className="field" value={f.airport_code} onChange={set("airport_code")}><option value="DXB">Dubai International (DXB)</option><option value="DWC">Al Maktoum International (DWC)</option></select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="pd">Departure</label><input id="pd" type="date" min={today} className="field" value={f.departure_date} onChange={set("departure_date")} /><Err k="departure_date" /></div>
          <div><label className="label" htmlFor="pr">Return</label><input id="pr" type="date" min={f.departure_date || today} className="field" value={f.return_date} onChange={set("return_date")} /><Err k="return_date" /></div></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="pt">Travelers</label><input id="pt" type="number" min="1" max="20" className="field" value={f.travelers} onChange={set("travelers")} /><Err k="travelers" /></div>
          <div><label className="label" htmlFor="pb">Total budget (BDT)</label><input id="pb" type="number" min="1000" step="1000" className="field" value={f.budget_bdt} onChange={set("budget_bdt")} /><Err k="budget_bdt" /></div></div>
        <div><label className="label" htmlFor="ph">Hotel category</label><select id="ph" className="field" value={f.hotel_category} onChange={set("hotel_category")}><option value="budget">Budget</option><option value="standard">Standard</option><option value="premium">Premium</option><option value="luxury">Luxury</option></select></div>
        <fieldset><legend className="label">Preferred activities</legend>
          <div className="grid grid-cols-1 gap-1.5">{ATTRACTIONS.map((a) => (
            <label key={a.slug} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#087E8B]" checked={f.activities.includes(a.slug)} onChange={() => toggle(a.slug)} />{a.name}<span className="ml-auto text-xs text-navy/50">{a.cost ? formatBDT(a.cost) : "Free"}</span></label>))}</div></fieldset>
        <div><label className="label" htmlFor="pp">Travel preferences (optional)</label><textarea id="pp" rows="2" className="field" maxLength={500} value={f.preferences} onChange={set("preferences")} placeholder="e.g. family friendly, halal food, near metro" /></div>
        {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}
        <button className="btn-primary w-full" disabled={busy}><Calculator size={16} />{est ? "Recalculate" : "Calculate my trip"}</button>
      </form>

      <div id="results" className="scroll-mt-24">
        {!est ? (
          <div className="card grid h-full min-h-[300px] place-items-center p-8 text-center text-navy/60"><div><p className="font-display text-2xl font-bold text-navy">Your trip estimate will appear here</p><p className="mt-2 text-sm">Pick dates, a budget in BDT and the things you want to do. Prices are configurable demo estimates, not live quotes.</p></div></div>
        ) : (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Trip estimate</h2><StatusBadge status={est.status} /></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                {[["Total estimated cost", est.total], ["Per person", est.perPerson], ["Your budget", est.budget], [est.remaining >= 0 ? "Remaining" : "Over by", Math.abs(est.remaining)]].map(([l, n]) => <div key={l} className="rounded-xl bg-canvas p-3"><p className="text-xs text-navy/60">{l}</p><p className="mt-1 text-lg font-bold">{formatBDT(n)}</p></div>)}
              </div>
              <p className="mt-4 text-xs text-navy/50">{est.nights} night(s), {est.travelers} traveler(s), {est.rooms} room(s). Estimates use demo prices.</p>
              <div className="mt-4 space-y-2.5">{Object.entries(est.breakdown).map(([k, n]) => (
                <div key={k}><div className="flex justify-between text-sm"><span>{LABELS[k]}</span><b>{formatBDT(n)}</b></div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-ocean" style={{ width: `${Math.max((n / maxB) * 100, 2)}%` }} /></div></div>))}</div>
              <button onClick={bookIt} className="btn-primary mt-6" disabled={busy}>Book My Personalized Trip</button>
              <p className="mt-2 text-xs text-navy/50">Saves this plan to your account and opens the booking form.</p>
            </div>

            <div className="card p-6"><h3 className="text-lg font-bold">Suggested hotels ({f.hotel_category})</h3>
              {est.recommendations.hotels.length === 0 ? <p className="mt-2 text-sm text-navy/60">No sample hotels in this category yet.</p> :
                <div className="mt-3 grid gap-3 sm:grid-cols-3">{est.recommendations.hotels.map((h) => (
                  <Link key={h.id} href={`/hotels/${h.id}`} className="overflow-hidden rounded-xl border border-slate-100 hover:shadow-card"><SafeImage src={h.image_url} alt={h.name} className="h-24 w-full" /><div className="p-3"><p className="text-sm font-bold">{h.name}</p><p className="text-xs text-navy/60">{h.location} · {formatBDT(h.price_per_night_bdt)}/night</p></div></Link>))}</div>}
            </div>

            <div className="card p-6"><h3 className="text-lg font-bold">Attractions & activities</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">{est.recommendations.attractions.map((a) => <li key={a.slug} className="flex justify-between rounded-lg bg-canvas px-3 py-2 text-sm"><span>{a.name}{a.suggested && <em className="ml-1 text-xs text-ocean">suggested</em>}</span><span className="text-navy/60">{a.cost ? formatBDT(a.cost) : "Free"}</span></li>)}</ul></div>

            <div className="card p-6"><h3 className="text-lg font-bold">Daily itinerary</h3>
              <ol className="mt-3 space-y-3">{est.itinerary.map((d) => <li key={d.day} className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ocean text-sm font-bold text-white">{d.day}</span><div><p className="font-semibold">{d.title}</p><p className="text-sm text-navy/70">{d.items.join(" · ")}</p></div></li>)}</ol></div>

            {est.recommendations.packages.length > 0 && (
              <div className="card p-6"><h3 className="text-lg font-bold">Packages that may suit you</h3>
                <div className="mt-3 space-y-2">{est.recommendations.packages.map((p) => <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-canvas p-3 text-sm"><div><p className="font-semibold">{p.name}</p><p className="text-xs text-navy/60">{p.nights} nights via {p.airport_code}</p></div><div className="text-right"><b>{formatBDT(p.total)}</b> <span className="text-xs text-navy/60">for {est.travelers}</span> <StatusBadge status={p.fits ? "within" : "over"} /></div></div>)}</div></div>)}
          </div>)}
      </div>
    </div>
  );
}
