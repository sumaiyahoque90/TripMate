import { Check, Clock, Circle, Gift } from "lucide-react";

const ICON = { completed: <Check size={16} className="text-emerald-600" />, awaiting_approval: <Clock size={16} className="text-amber-600" />, pending: <Circle size={16} className="text-slate-300" /> };
const TEXT = { completed: "Completed", awaiting_approval: "Submitted, awaiting approval", pending: "Pending" };

export default function RewardProgress({ progress }) {
  const p = progress; const s = p.settings;
  return (
    <div className="card overflow-hidden">
      <div className="bg-navy p-5 text-white"><p className="flex items-center gap-2 font-display text-xl font-bold"><Gift size={20} />TripMate Travel Rewards</p><p className="mt-1 text-sm text-white/70">Review &amp; Save {s.discount_percent}%</p></div>
      <div className="p-5">
        <ul className="space-y-2">{p.slots.map((sl) => <li key={sl.n} className="flex items-center gap-2 text-sm">{ICON[sl.status]}<b>Review {sl.n}:</b> {TEXT[sl.status]}</li>)}</ul>
        <div className="mt-4"><div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-ocean transition-all" style={{ width: `${(p.completed / p.required) * 100}%` }} /></div>
          <p className="mt-2 text-sm font-semibold">{p.completed} / {p.required} Reviews Completed</p></div>
        {p.unlocked && <p className="mt-4 rounded-xl bg-teal-soft p-3 text-sm font-semibold">Congratulations! You&apos;ve unlocked a {s.discount_percent}% Dubai Hotel Discount!</p>}
        {p.vouchers.length > 0 && (
          <div className="mt-4 space-y-2">{p.vouchers.map((v) => (
            <div key={v.id} className="rounded-xl border border-dashed border-ocean p-3"><p className="font-mono text-lg font-bold tracking-wide text-ocean">{v.code}</p>
              <p className="text-xs text-navy/60">{v.discount_percent}% off at {v.partner_hotel_name || "partner hotel"} · {v.status === "active" ? `valid until ${new Date(v.expires_at).toISOString().slice(0, 10)}` : v.status}</p></div>))}</div>)}
      </div>
    </div>
  );
}
