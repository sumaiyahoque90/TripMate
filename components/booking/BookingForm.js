"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { computeBookingTotal, nightsBetween } from "@/lib/pricing";
import { formatBDT } from "@/lib/utils";

const TYPES = [["flight", "Flight only"], ["hotel", "Hotel only"], ["package", "Complete package"], ["personalized", "Personalized trip"]];
const CABINS = { economy: "Economy", premium_economy: "Premium Economy", business: "Business", first: "First" };

export default function BookingForm({ user, initial = {}, options = {}, lockType = false, signInNext = "/book" }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const { flights = [], hotels = [], packages = [], plans = [] } = options;
  const [v, setV] = useState({
    type: initial.type || "flight", full_name: user?.full_name || "", email: user?.email || "", phone: user?.phone || "",
    airport_code: initial.airport || "DXB", departure_date: initial.departure || "", return_date: initial.return || "",
    travelers: Number(initial.travelers) || 1, flight_id: initial.flight || "", hotel_id: initial.hotel || "", package_id: initial.package || "",
    trip_plan_id: initial.plan || "", room_type: "", cabin_class: initial.cabin || "economy", passengers: [], voucher_code: "", special_requests: "",
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [vch, setVch] = useState(null);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); if (["voucher_code", "room_type", "hotel_id", "travelers"].includes(k) || k.endsWith("_date")) setVch(null); };

  const flight = flights.find((f) => String(f.id) === String(v.flight_id));
  const hotel = hotels.find((h) => String(h.id) === String(v.hotel_id));
  const pkg = packages.find((p) => String(p.id) === String(v.package_id));
  const plan = plans.find((p) => String(p.id) === String(v.trip_plan_id));
  const nights = nightsBetween(v.departure_date, v.return_date);
  const roomTypes = hotel?.room_types || [];
  const preview = useMemo(() => computeBookingTotal({ type: v.type, flight, hotel, pkg, planTotal: plan ? Number(plan.estimate.total) : null, travelers: v.type === "personalized" ? plan?.travelers : v.travelers, nights, roomType: v.room_type }),
    [v.type, flight, hotel, pkg, plan, v.travelers, nights, v.room_type]);
  const discount = vch?.discount_bdt || 0;

  const setPax = (i, val) => { const p = [...v.passengers]; p[i] = { full_name: val }; setV({ ...v, passengers: p }); };
  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-xs text-red-600">{errors[k]}</p> : null);

  async function applyVoucher() {
    setMsg(""); setErrors({});
    const r = await fetch("/api/rewards/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: v.voucher_code, hotel_id: v.hotel_id, room_type: v.room_type, departure_date: v.departure_date, return_date: v.return_date, travelers: v.travelers }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setVch(null); setErrors({ voucher_code: d.error || "Voucher could not be applied." }); return; }
    setVch(d);
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg(""); setErrors({});
    const body = { ...v, travelers: Number(v.travelers), passengers: [{ full_name: v.full_name }, ...v.passengers.filter(Boolean)] };
    const r = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErrors(d.errors || {}); return setMsg(d.error || "Could not submit your request."); }
    setDone(d.booking); router.refresh();
  }

  if (!user) return (
    <div className="card p-6"><p className="font-semibold">Sign in to submit a booking request.</p>
      <p className="mt-1 text-sm text-navy/70">We need an account so you can track your request and its status.</p>
      <div className="mt-4 flex gap-3"><Link href={`/login?next=${encodeURIComponent(signInNext)}`} className="btn-primary">Sign in</Link><Link href="/register" className="btn-light border border-slate-200">Create account</Link></div></div>);

  if (done) return (
    <div className="card p-8 text-center">
      <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
      <h2 className="mt-3 text-2xl font-bold">Request received</h2>
      <p className="mt-2 text-navy/70">Your booking reference is</p>
      <p className="my-2 font-mono text-3xl font-bold text-ocean">{done.reference}</p>
      <p className="mx-auto max-w-md text-sm text-navy/70">Status: <b>Pending</b>. This is a request, not a ticket or confirmed reservation. We will confirm after reviewing it. Totals are estimates.</p>
      {Number(done.discount_bdt) > 0 && <p className="mt-2 text-sm text-emerald-700">Voucher applied: you save {formatBDT(done.discount_bdt)} on accommodation.</p>}
      <div className="mt-6 flex justify-center gap-3"><Link href="/dashboard" className="btn-primary">Track in my dashboard</Link><Link href="/" className="btn-light border border-slate-200">Back home</Link></div>
    </div>);

  return (
    <form onSubmit={submit} className="card space-y-6 p-5 sm:p-7" noValidate>
      {!lockType && (
        <div role="tablist" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TYPES.map(([k, l]) => <button type="button" role="tab" aria-selected={v.type === k} key={k} onClick={() => { setV({ ...v, type: k }); setVch(null); }}
            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${v.type === k ? "border-ocean bg-teal-soft text-navy" : "border-slate-200 hover:bg-slate-50"}`}>{l}</button>)}
        </div>)}
      <Err k="type" />

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-bold">Your details</legend>
        <div><label className="label" htmlFor="bn">Full name</label><input id="bn" className="field" value={v.full_name} onChange={set("full_name")} autoComplete="name" /><Err k="full_name" /></div>
        <div><label className="label" htmlFor="be">Email</label><input id="be" type="email" className="field" value={v.email} onChange={set("email")} autoComplete="email" /><Err k="email" /></div>
        <div><label className="label" htmlFor="bp">Phone</label><input id="bp" type="tel" className="field" value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="+8801XXXXXXXXX" /><Err k="phone" /></div>
        <div className="grid grid-cols-2 gap-3"><div><label className="label">Departure city</label><input className="field bg-slate-50" value="Dhaka" disabled /></div><div><label className="label">Destination</label><input className="field bg-slate-50" value="Dubai" disabled /></div></div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-bold">Trip</legend>
        {v.type === "personalized" ? (
          <div className="sm:col-span-2"><label className="label" htmlFor="bpl">Saved trip plan</label>
            <select id="bpl" className="field" value={v.trip_plan_id} onChange={set("trip_plan_id")}><option value="">Select a plan</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.airport_code} · {p.departure_date} → {p.return_date} · {p.travelers} traveler(s) · {formatBDT(p.estimate.total)}</option>)}</select>
            <Err k="trip_plan_id" />{plans.length === 0 && <p className="mt-1 text-xs text-navy/60">No unbooked plans. <Link href="/planner" className="font-semibold text-ocean">Create one in the planner</Link>.</p>}</div>
        ) : (<>
          {v.type !== "hotel" && (<div><label className="label" htmlFor="ba">Airport</label><select id="ba" className="field" value={v.airport_code} onChange={set("airport_code")}><option value="DXB">Dubai International (DXB)</option><option value="DWC">Al Maktoum International (DWC)</option></select><Err k="airport_code" /></div>)}
          <div><label className="label" htmlFor="bd">{v.type === "hotel" ? "Check-in" : "Departure date"}</label><input id="bd" type="date" min={today} className="field" value={v.departure_date} onChange={set("departure_date")} /><Err k="departure_date" /></div>
          <div><label className="label" htmlFor="br">{v.type === "hotel" ? "Check-out" : "Return date"}</label><input id="br" type="date" min={v.departure_date || today} className="field" value={v.return_date} onChange={set("return_date")} /><Err k="return_date" /></div>
          <div><label className="label" htmlFor="bt">Travelers</label><input id="bt" type="number" min="1" max="20" className="field" value={v.travelers} onChange={set("travelers")} /><Err k="travelers" /></div>
        </>)}
        {v.type === "flight" && (<>
          <div><label className="label" htmlFor="bf">Selected flight (optional)</label>
            <select id="bf" className="field" value={v.flight_id} onChange={(e) => { const f = flights.find((x) => String(x.id) === e.target.value); setV({ ...v, flight_id: e.target.value, airport_code: f?.destination_code || v.airport_code }); }}>
              <option value="">No preference: send a quotation request</option>
              {flights.filter((f) => f.destination_code === v.airport_code).map((f) => <option key={f.id} value={f.id}>{f.airline} {f.flight_number} · {CABINS[f.cabin_class]} · {formatBDT(f.estimated_price_bdt)} (sample)</option>)}</select></div>
          <div><label className="label" htmlFor="bc">Cabin class</label><select id="bc" className="field" value={v.cabin_class} onChange={set("cabin_class")}>{Object.entries(CABINS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
        </>)}
        {v.type === "hotel" && (<>
          <div><label className="label" htmlFor="bh">Hotel</label><select id="bh" className="field" value={v.hotel_id} onChange={(e) => { setV({ ...v, hotel_id: e.target.value, room_type: "" }); setVch(null); }}><option value="">Select a hotel</option>{hotels.map((h) => <option key={h.id} value={h.id}>{h.name} · {formatBDT(h.price_per_night_bdt)}/night</option>)}</select><Err k="hotel_id" /></div>
          <div><label className="label" htmlFor="brm">Room type</label><select id="brm" className="field" value={v.room_type} onChange={set("room_type")} disabled={!hotel}><option value="">Select a room</option>{roomTypes.map((r) => <option key={r.name} value={r.name}>{r.name}{r.extra ? ` (+${formatBDT(r.extra)}/night)` : ""}</option>)}</select><Err k="room_type" /></div>
        </>)}
        {v.type === "package" && (<div className="sm:col-span-2"><label className="label" htmlFor="bk">Travel package</label><select id="bk" className="field" value={v.package_id} onChange={(e) => { const p = packages.find((x) => String(x.id) === e.target.value); setV({ ...v, package_id: e.target.value, airport_code: p?.airport_code || v.airport_code }); }}><option value="">Select a package</option>{packages.map((p) => <option key={p.id} value={p.id}>{p.name} · {formatBDT(p.price_per_person_bdt)}/person · {p.nights} nights</option>)}</select><Err k="package_id" /></div>)}
      </fieldset>

      {v.type === "flight" && v.travelers > 1 && (
        <fieldset className="grid gap-3 sm:grid-cols-2"><legend className="mb-2 text-sm font-bold">Other passengers (names as on passport)</legend>
          {Array.from({ length: Math.min(v.travelers - 1, 19) }, (_, i) => <input key={i} className="field" placeholder={`Passenger ${i + 2} full name`} value={v.passengers[i]?.full_name || ""} onChange={(e) => setPax(i, e.target.value)} aria-label={`Passenger ${i + 2} name`} />)}</fieldset>)}

      {v.type === "hotel" && (
        <div><label className="label" htmlFor="bv">Reward voucher code (optional)</label>
          <div className="flex gap-2"><input id="bv" className="field uppercase" placeholder="TRIPMATE20-XXXXX" value={v.voucher_code} onChange={set("voucher_code")} />
            <button type="button" className="btn-light border border-slate-200" onClick={applyVoucher} disabled={!v.voucher_code || !v.hotel_id || !nights}>Apply</button></div>
          <Err k="voucher_code" />
          {vch && <p className="mt-1 text-sm text-emerald-700">Voucher valid: {vch.discount_percent}% off accommodation, saving {formatBDT(vch.discount_bdt)}.</p>}
          <p className="mt-1 text-xs text-navy/50">Works only at the configured partner hotel, once, on hotel accommodation charges.</p></div>)}

      <div><label className="label" htmlFor="bs">Special requests</label><textarea id="bs" rows="3" className="field" value={v.special_requests} onChange={set("special_requests")} maxLength={1000} /></div>

      <div className="rounded-xl bg-teal-soft p-4 text-sm">
        <div className="flex items-center justify-between"><span>Estimated total{discount ? " (after voucher)" : ""}</span>
          <b className="text-lg">{preview.total === null ? "Quotation on request" : formatBDT(Math.max(preview.total - discount, 0))}</b></div>
        {discount > 0 && <p className="mt-1 text-xs text-emerald-700">Includes voucher saving of {formatBDT(discount)}.</p>}
        <p className="mt-1 text-xs text-navy/60">Estimate only. Final price is confirmed by our team. No payment is taken now.</p>
      </div>
      {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}
      <button className="btn-primary w-full sm:w-auto" disabled={busy}>{busy ? "Submitting…" : "Submit booking request"}</button>
    </form>
  );
}
