"use client";
import { useCallback, useEffect, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import ResourceManager from "./ResourceManager";
import { api } from "./api";
import { formatBDT } from "@/lib/utils";

const TABS = ["Overview", "Bookings", "Reviews", "Rewards", "Hotels", "Flights", "Packages", "Messages"];
const NEXT = { pending: ["confirmed", "cancelled"], confirmed: ["completed", "cancelled"], completed: [], cancelled: [] };
const d10 = (x) => (x ? String(x).slice(0, 10) : "–");

function Overview() {
  const [s, setS] = useState(null);
  useEffect(() => { api("GET", "/api/admin/dashboard").then((r) => r.ok && setS(r.data.stats)); }, []);
  if (!s) return <p className="text-sm text-navy/60">Loading…</p>;
  const items = [["Total customers", s.customers], ["Flight bookings", s.flight_bookings], ["Hotel bookings", s.hotel_bookings], ["Trip bookings", s.trip_bookings], ["Pending requests", s.pending], ["Confirmed", s.confirmed], ["Completed", s.completed], ["Total reviews", s.total_reviews], ["Pending review approvals", s.pending_reviews], ["Vouchers generated", s.vouchers], ["Vouchers active", s.active], ["Vouchers redeemed", s.redeemed], ["Unread messages", s.unread_messages]];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(([l, n]) => <div key={l} className="card p-5"><p className="text-xs text-navy/60">{l}</p><p className="mt-1 font-display text-3xl font-bold">{n}</p></div>)}</div>;
}

function Bookings() {
  const [rows, setRows] = useState([]); const [filter, setFilter] = useState(""); const [err, setErr] = useState("");
  const load = useCallback(async () => { const r = await api("GET", `/api/admin/bookings${filter ? `?status=${filter}` : ""}`); if (r.ok) setRows(r.data.bookings); }, [filter]);
  useEffect(() => { load(); }, [load]);
  async function setStatus(id, status) { setErr(""); const r = await api("PATCH", `/api/bookings/${id}/status`, { status }); if (!r.ok) setErr(r.data.error); load(); }
  return (
    <div>
      <div className="mb-4 flex items-center gap-3"><label className="label !mb-0" htmlFor="bf">Filter</label><select id="bf" className="field !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All</option>{Object.keys(NEXT).map((s) => <option key={s}>{s}</option>)}</select></div>
      {err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-card"><table className="w-full text-left text-sm"><thead className="bg-canvas text-xs uppercase text-navy/60"><tr>{["Ref", "Customer", "Type / details", "Dates", "Pax", "Est. total", "Status", "Update"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{rows.map((b) => (
          <tr key={b.id} className="align-top"><td className="px-4 py-3 font-mono font-bold text-ocean">{b.reference}</td>
            <td className="px-4 py-3">{b.full_name}<br /><span className="text-xs text-navy/60">{b.email} · {b.phone}</span></td>
            <td className="px-4 py-3 capitalize">{b.type}<br /><span className="text-xs text-navy/60">{b.hotel_name ? `${b.hotel_name} (${b.room_type})` : b.package_name || (b.airline ? `${b.airline} ${b.flight_number}` : b.airport_code)}{b.voucher_code ? ` · ${b.voucher_code}` : ""}</span>{b.special_requests && <><br /><span className="text-xs italic text-navy/50">“{b.special_requests}”</span></>}</td>
            <td className="px-4 py-3 text-xs">{d10(b.departure_date)}<br />{d10(b.return_date)}</td><td className="px-4 py-3">{b.travelers}</td>
            <td className="px-4 py-3">{b.estimated_total_bdt === null ? "Quote" : formatBDT(b.estimated_total_bdt)}{Number(b.discount_bdt) > 0 && <><br /><span className="text-xs text-emerald-700">−{formatBDT(b.discount_bdt)}</span></>}</td>
            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
            <td className="space-x-2 whitespace-nowrap px-4 py-3">{NEXT[b.status].map((s) => <button key={s} onClick={() => setStatus(b.id, s)} className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${s === "cancelled" ? "bg-red-50 text-red-700" : "bg-teal-soft text-navy"}`}>{s}</button>)}</td></tr>))}</tbody></table></div>
      {rows.length === 0 && <p className="mt-4 text-sm text-navy/60">No bookings.</p>}
    </div>
  );
}

function Reviews() {
  const [rows, setRows] = useState([]); const [filter, setFilter] = useState("pending"); const [note, setNote] = useState(""); const [err, setErr] = useState("");
  const load = useCallback(async () => { const r = await api("GET", `/api/admin/reviews${filter ? `?status=${filter}` : ""}`); if (r.ok) setRows(r.data.reviews); }, [filter]);
  useEffect(() => { load(); }, [load]);
  async function decide(id, status) {
    setNote(""); setErr("");
    const r = await api("PATCH", `/api/reviews/${id}/approval`, { status });
    if (!r.ok) setErr(r.data.error); else if (r.data.vouchers_issued?.length) setNote(`Reward voucher generated: ${r.data.vouchers_issued.join(", ")}`);
    load();
  }
  return (
    <div>
      <div className="mb-4 flex items-center gap-3"><label className="label !mb-0" htmlFor="rf">Show</label><select id="rf" className="field !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">All</option><option>pending</option><option>approved</option><option>rejected</option></select></div>
      {note && <p className="mb-3 rounded-xl bg-teal-soft p-3 text-sm font-semibold">{note}</p>}{err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
      <div className="space-y-3">{rows.map((r) => (
        <div key={r.id} className="card p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm"><b>{r.full_name}</b> <span className="text-navy/60">· {r.reference} ({r.booking_type})</span></p><StatusBadge status={r.status} /></div>
          <p className="mt-1 text-amber-500">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5 - r.rating)}</span></p>
          {r.title && <p className="font-semibold">{r.title}</p>}<p className="text-sm text-navy/80">{r.comment}</p>
          {r.status === "pending" && <div className="mt-3 flex gap-2"><button onClick={() => decide(r.id, "approved")} className="btn-primary !py-1.5 !text-xs">Approve</button><button onClick={() => decide(r.id, "rejected")} className="btn !bg-red-50 !py-1.5 !text-xs !text-red-700">Reject</button></div>}
        </div>))}</div>
      {rows.length === 0 && <p className="text-sm text-navy/60">No reviews.</p>}
    </div>
  );
}

function Rewards() {
  const [d, setD] = useState(null); const [form, setForm] = useState(null); const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const r = await api("GET", "/api/admin/rewards"); if (r.ok) { setD(r.data); const s = r.data.settings; setForm({ ...s, partner_hotel_id: s.partner_hotel_id || "", eligible_room_types: (s.eligible_room_types || []).join(", ") }); } }, []);
  useEffect(() => { load(); }, [load]);
  if (!d || !form) return <p className="text-sm text-navy/60">Loading…</p>;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  async function save(e) { e.preventDefault(); setMsg(""); const r = await api("PUT", "/api/admin/rewards", form); setMsg(r.ok ? "Saved." : r.data.error); if (r.ok) load(); }
  async function expire(id) { if (!confirm("Expire this voucher?")) return; await api("PATCH", "/api/admin/rewards", { voucher_id: id, action: "expire" }); load(); }
  return (
    <div className="space-y-8">
      <form onSubmit={save} className="card grid gap-3 p-5 sm:grid-cols-2">
        <h3 className="font-bold sm:col-span-2">Reward program settings</h3>
        <div><label className="label" htmlFor="rh">Partner hotel</label><select id="rh" className="field" value={form.partner_hotel_id} onChange={set("partner_hotel_id")}><option value="">None</option>{d.hotels.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.location})</option>)}</select></div>
        <div><label className="label" htmlFor="rr">Eligible room types (comma separated)</label><input id="rr" className="field" value={form.eligible_room_types} onChange={set("eligible_room_types")} /></div>
        <div><label className="label" htmlFor="rq">Reviews required</label><input id="rq" type="number" className="field" value={form.reviews_required} onChange={set("reviews_required")} /></div>
        <div><label className="label" htmlFor="rp">Discount %</label><input id="rp" type="number" className="field" value={form.discount_percent} onChange={set("discount_percent")} /></div>
        <div><label className="label" htmlFor="rd">Voucher validity (days)</label><input id="rd" type="number" className="field" value={form.voucher_valid_days} onChange={set("voucher_valid_days")} /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="rc">Booking conditions</label><textarea id="rc" rows="2" className="field" value={form.conditions || ""} onChange={set("conditions")} /></div>
        <div className="flex items-center gap-3 sm:col-span-2"><button className="btn-primary !py-2">Save settings</button>{msg && <span className="text-sm">{msg}</span>}</div>
        <p className="text-xs text-navy/50 sm:col-span-2">Changes apply to vouchers issued from now on. Existing vouchers keep their partner hotel and discount.</p>
      </form>
      <div><h3 className="mb-3 font-bold">Vouchers</h3>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card"><table className="w-full text-left text-sm"><thead className="bg-canvas text-xs uppercase text-navy/60"><tr>{["Code", "Customer", "Discount", "Status", "Expires", "Redeemed", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{d.vouchers.map((v) => <tr key={v.id}><td className="px-4 py-3 font-mono font-bold">{v.code}</td><td className="px-4 py-3">{v.full_name}<br /><span className="text-xs text-navy/60">{v.email}</span></td><td className="px-4 py-3">{v.discount_percent}%</td><td className="px-4 py-3"><StatusBadge status={v.status} /></td><td className="px-4 py-3">{d10(v.expires_at)}</td><td className="px-4 py-3">{d10(v.redeemed_at)}</td><td className="px-4 py-3">{v.status === "active" && <button className="text-xs font-semibold text-red-600" onClick={() => expire(v.id)}>Expire</button>}</td></tr>)}</tbody></table></div>
        {d.vouchers.length === 0 && <p className="mt-3 text-sm text-navy/60">No vouchers generated yet.</p>}</div>
    </div>
  );
}

function Messages() {
  const [rows, setRows] = useState([]);
  const load = useCallback(async () => { const r = await api("GET", "/api/admin/messages"); if (r.ok) setRows(r.data.messages); }, []);
  useEffect(() => { load(); }, [load]);
  return <div className="space-y-3">{rows.map((m) => <div key={m.id} className={`card p-4 ${m.is_read ? "opacity-60" : ""}`}><div className="flex justify-between text-sm"><b>{m.name} <span className="font-normal text-navy/60">&lt;{m.email}&gt;</span></b><span className="text-xs text-navy/50">{d10(m.created_at)}</span></div>{m.subject && <p className="font-semibold">{m.subject}</p>}<p className="whitespace-pre-wrap text-sm text-navy/80">{m.message}</p>{!m.is_read && <button className="mt-2 text-xs font-semibold text-ocean" onClick={async () => { await api("PATCH", "/api/admin/messages", { id: m.id }); load(); }}>Mark as read</button>}</div>)}{rows.length === 0 && <p className="text-sm text-navy/60">No messages.</p>}</div>;
}

export default function AdminPanel() {
  const [tab, setTab] = useState("Overview");
  return (
    <div>
      <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200">{TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold ${tab === t ? "border-ocean text-ocean" : "border-transparent text-navy/60 hover:text-navy"}`}>{t}</button>)}</div>
      {tab === "Overview" && <Overview />}{tab === "Bookings" && <Bookings />}{tab === "Reviews" && <Reviews />}{tab === "Rewards" && <Rewards />}
      {tab === "Hotels" && <ResourceManager resource="hotels" columns={["name", "location", "category", "price_per_night_bdt", "is_partner", "is_active"]} />}
      {tab === "Flights" && <ResourceManager resource="flights" columns={["airline", "flight_number", "destination_code", "cabin_class", "estimated_price_bdt", "is_active"]} />}
      {tab === "Packages" && <ResourceManager resource="packages" columns={["name", "nights", "airport_code", "price_per_person_bdt", "is_active"]} />}
      {tab === "Messages" && <Messages />}
    </div>
  );
}
