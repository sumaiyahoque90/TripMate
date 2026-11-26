"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Plane } from "lucide-react";

const LINKS = [
  ["/flights", "Flights"], ["/hotels", "Hotels"], ["/destinations", "Dubai"],
  ["/planner", "Trip planner"], ["/rewards", "Rewards"], ["/contact", "Contact"],
];

export default function NavLinks({ user }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false); router.push("/"); router.refresh();
  }
  const account = user ? (
    <>
      <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="btn-primary !py-2" onClick={() => setOpen(false)}>
        {user.role === "admin" ? "Admin" : "My trips"}
      </Link>
      <button onClick={logout} className="text-sm font-semibold text-navy/70 hover:text-navy">Sign out</button>
    </>
  ) : (
    <>
      <Link href="/login" className="text-sm font-semibold text-navy/70 hover:text-navy" onClick={() => setOpen(false)}>Sign in</Link>
      <Link href="/register" className="btn-primary !py-2" onClick={() => setOpen(false)}>Create account</Link>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-navy">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ocean text-white"><Plane size={17} /></span>TripMate
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map(([h, l]) => <Link key={h} href={h} className="text-sm font-medium text-navy/70 hover:text-ocean">{l}</Link>)}
        </div>
        <div className="hidden items-center gap-4 md:flex">{account}</div>
        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="space-y-1 border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
          {LINKS.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-2.5 text-sm font-medium hover:bg-teal-soft">{l}</Link>)}
          <div className="flex items-center gap-4 pt-3">{account}</div>
        </div>
      )}
    </header>
  );
}
