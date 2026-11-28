"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const isReg = mode === "register";
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [v, setV] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg(""); setErrors({});
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErrors(data.errors || {}); return setMsg(data.error || "Something went wrong."); }
    router.push(next && next.startsWith("/") ? next : data.user.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }
  // NOTE: this is a plain function that returns JSX, NOT a component. Defining a component inside render
  // would create a new component type on every keystroke, remounting the input and losing focus.
  const field = (k, label, type = "text", auto) => (
    <div key={k}><label className="label" htmlFor={k}>{label}</label>
      <input id={k} type={type} autoComplete={auto} className="field" value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]} />
      {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}</div>);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={submit} className="card space-y-4 p-6">
        <h1 className="text-2xl font-bold">{isReg ? "Create your account" : "Sign in"}</h1>
        {isReg && field("full_name", "Full name", "text", "name")}
        {field("email", "Email", "email", "email")}
        {isReg && field("phone", "Phone (optional)", "tel", "tel")}
        {field("password", "Password", "password", isReg ? "new-password" : "current-password")}
        {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Please wait…" : isReg ? "Create account" : "Sign in"}</button>
        <p className="text-center text-sm text-navy/70">{isReg ? <>Already registered? <Link href="/login" className="font-semibold text-ocean">Sign in</Link></> : <>New to TripMate? <Link href="/register" className="font-semibold text-ocean">Create an account</Link></>}</p>
      </form>
    </div>
  );
}
