"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Clock } from "lucide-react";
import { formatBDT } from "@/lib/utils";

const CABINS = { economy: "Economy", premium_economy: "Premium Economy", business: "Business", first: "First" };
const hm = (t) => (t ? String(t).slice(0, 5) : "–");
const dur = (m) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : "–");

export default function FlightExplorer({ initial }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ airport: initial.airport || "DXB", departure: initial.departure || "", ret: initial.return || "", travelers: initial.travelers || 1, cabin: initial.cabin || "economy" });
  const [res, setRes] = useState(null);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function search(e) {
    e?.preventDefault(); setBusy(true); setMsg(""); setErrs({});
    const r = await fetch("/api/flights/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ airport: f.airport, departure: f.departure, return: f.ret, travelers: Number(f.travelers), cabin: f.cabin }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErrs(d.errors || {}); setMsg(d.error || "Search failed."); setRes(null); return; }
    setRes(d);
  }
  useEffect(() => { if (initial.departure) search(); /* eslint-disable-next-line */ }, []);

  const q = (extra = {}) => new URLSearchParams({ type: "flight", airport: f.airport, departure: f.departure, return: f.ret, travelers: f.travelers, cabin: f.cabin, ...extra }).toString();
  const Err = ({ k }) => (errs[k] ? <p className="mt-1 text-xs text-red-600">{errs[k]}</p> : null);

  return (
    <div>
      <form onSubmit={search} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-start">
        <div><label className="label">From</label><input className="field bg-slate-50" value="Dhaka (DAC)" disabled /></div>
        <div><label className="label" htmlFor="fa">To</label>
          <select id="fa" className="field" value={f.airport} onChange={set("airport")}><option value="DXB">Dubai Intl (DXB)</option><option value="DWC">Al Maktoum Intl (DWC)</option></select><Err k="airport" /></div>
        <div><label className="label" htmlFor="fd">Departure</label><input id="fd" type="date" min={today} className="field" value={f.departure} onChange={set("departure")} /><Err k="departure_date" /></div>
        <div><label className="label" htmlFor="fr">Return</label><input id="fr" type="date" min={f.departure || today} className="field" value={f.ret} onChange={set("ret")} /><Err k="return_date" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="ft">Travelers</label><input id="ft" type="number" min="1" max="9" className="field" value={f.travelers} onChange={set("travelers")} /><Err k="travelers" /></div>
          <div><label className="label" htmlFor="fc">Cabin</label><select id="fc" className="field" value={f.cabin} onChange={set("cabin")}>{Object.entries(CABINS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        </div>
        <button className="btn-primary mt-[22px] h-[42px]" disabled={busy}>{busy ? "Searching…" : "Search flights"}</button>
      </form>
      {msg && <p role="alert" className="mt-3 text-sm text-red-600">{msg}</p>}

      {res && (
        <div className="mt-6">
          <p className="rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800">{res.notice} Flight times shown are sample data, not live availability.</p>
          {res.flights.length === 0 ? (
            <div className="card mt-4 p-6"><p className="font-semibold">No sample flights for {CABINS[f.cabin]} on this route.</p>
              <p className="mt-1 text-sm text-navy/70">You can still send a quotation request and our team will reply with options.</p>
              <Link href={`/book?${q()}`} className="btn-primary mt-4">Request a quotation</Link></div>
          ) : (
            <ul className="mt-4 space-y-3">
              {res.flights.map((fl) => (
                <li key={fl.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-soft text-ocean"><Plane size={20} /></span>
                    <div><p className="font-bold">{fl.airline} <span className="text-xs font-medium text-navy/60">{fl.flight_number}</span></p>
                      <p className="text-sm text-navy/70">DAC {hm(fl.departure_time)} → {fl.destination_code} {hm(fl.arrival_time)} <span className="mx-1">·</span><Clock size={12} className="inline" /> {dur(fl.duration_minutes)}</p>
                      <p className="text-xs text-navy/50">{fl.destination_name} · {CABINS[fl.cabin_class]} · sample</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-ocean">{formatBDT(fl.estimated_total_bdt)}</p>
                    <p className="text-xs text-navy/60">est. total for {f.travelers} · {formatBDT(fl.estimated_price_bdt)} each</p>
                    <Link href={`/book?${q({ flight: fl.id })}`} className="btn-primary mt-2 !py-2">Select flight</Link>
                  </div>
                </li>))}
            </ul>)}
        </div>)}
    </div>
  );
}
