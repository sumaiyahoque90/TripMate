"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({}); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg(""); setErrors({});
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    const d = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok) { setErrors(d.errors || {}); return setMsg(d.error || "Could not send your message."); }
    setDone(true);
  }
  if (done) return <div className="card p-8 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={40} /><p className="mt-3 text-xl font-bold">Message sent</p><p className="mt-1 text-sm text-navy/70">Thanks. Our team will reply by email.</p></div>;
  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-xs text-red-600">{errors[k]}</p> : null);
  return (
    <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="cn">Name</label><input id="cn" className="field" value={v.name} onChange={set("name")} autoComplete="name" /><Err k="name" /></div>
        <div><label className="label" htmlFor="ce">Email</label><input id="ce" type="email" className="field" value={v.email} onChange={set("email")} autoComplete="email" /><Err k="email" /></div></div>
      <div><label className="label" htmlFor="cs">Subject</label><input id="cs" className="field" value={v.subject} onChange={set("subject")} /></div>
      <div><label className="label" htmlFor="cm">Message</label><textarea id="cm" rows="5" className="field" value={v.message} onChange={set("message")} /><Err k="message" /></div>
      {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}
      <button className="btn-primary" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
    </form>
  );
}
