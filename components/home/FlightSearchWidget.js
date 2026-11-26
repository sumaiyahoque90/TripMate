"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function FlightSearchWidget() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ airport: "DXB", departure: "", ret: "", travelers: 1, cabin: "economy" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    if (!f.departure) return setErr("Choose a departure date.");
    if (f.ret && f.ret < f.departure) return setErr("Return date must be after departure.");
    setErr("");
    router.push(`/flights?${new URLSearchParams({ airport: f.airport, departure: f.departure, return: f.ret, travelers: f.travelers, cabin: f.cabin })}`);
  }

  return (
    <form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end" aria-label="Flight search">
      <div><label className="label">From</label><input className="field bg-slate-50" value="Dhaka (DAC)" disabled /></div>
      <div><label className="label" htmlFor="ap">To</label>
        <select id="ap" className="field" value={f.airport} onChange={set("airport")}>
          <option value="DXB">Dubai International (DXB)</option>
          <option value="DWC">Al Maktoum International (DWC)</option>
        </select></div>
      <div><label className="label" htmlFor="dep">Departure</label><input id="dep" type="date" min={today} className="field" value={f.departure} onChange={set("departure")} /></div>
      <div><label className="label" htmlFor="ret">Return</label><input id="ret" type="date" min={f.departure || today} className="field" value={f.ret} onChange={set("ret")} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label" htmlFor="tr">Travelers</label><input id="tr" type="number" min="1" max="9" className="field" value={f.travelers} onChange={set("travelers")} /></div>
        <div><label className="label" htmlFor="cb">Cabin</label>
          <select id="cb" className="field" value={f.cabin} onChange={set("cabin")}>
            <option value="economy">Economy</option><option value="premium_economy">Premium</option><option value="business">Business</option><option value="first">First</option>
          </select></div>
      </div>
      <button className="btn-primary h-[42px]"><Search size={16} />Search</button>
      {err && <p role="alert" className="text-sm text-red-600 sm:col-span-2 lg:col-span-6">{err}</p>}
    </form>
  );
}
