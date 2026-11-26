"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export function CancelButton({ id }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function go() {
    if (!confirm("Cancel this pending request?")) return;
    setBusy(true); setErr("");
    const r = await fetch(`/api/bookings/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "cancelled" }) });
    setBusy(false);
    if (!r.ok) return setErr((await r.json().catch(() => ({}))).error || "Could not cancel.");
    router.refresh();
  }
  return <span><button onClick={go} disabled={busy} className="text-xs font-semibold text-red-600 hover:underline">{busy ? "Cancelling…" : "Cancel"}</button>{err && <span className="ml-2 text-xs text-red-600">{err}</span>}</span>;
}

export function ReviewForm({ bookingId, reference }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ rating: 5, title: "", comment: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: bookingId, ...v }) });
    const d = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok) return setErr(d.errors?.comment || d.error || "Could not submit.");
    setSent(true); router.refresh();
  }
  if (sent) return <span className="text-xs font-semibold text-emerald-700">Review submitted, awaiting approval</span>;
  if (!open) return <button onClick={() => setOpen(true)} className="text-xs font-semibold text-ocean hover:underline">Write review</button>;
  return (
    <form onSubmit={submit} className="mt-3 w-full space-y-2 rounded-xl bg-canvas p-3 text-left" aria-label={`Review for ${reference}`}>
      <p className="text-xs font-semibold">Review for {reference}</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} role="radio" aria-checked={v.rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setV({ ...v, rating: n })}><Star size={20} className={n <= v.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} /></button>)}</div>
      <input className="field" placeholder="Title (optional)" maxLength={160} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} />
      <textarea className="field" rows="3" placeholder="Tell us honestly how it went (20+ characters)" value={v.comment} onChange={(e) => setV({ ...v, comment: e.target.value })} />
      {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
      <div className="flex gap-3"><button className="btn-primary !py-1.5 !text-xs" disabled={busy}>{busy ? "Sending…" : "Submit review"}</button><button type="button" className="text-xs" onClick={() => setOpen(false)}>Close</button></div>
      <p className="text-[11px] text-navy/50">Your rating does not affect rewards. Reviews are approved by our team before they count.</p>
    </form>
  );
}
