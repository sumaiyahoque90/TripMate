import FlightExplorer from "@/components/flights/FlightExplorer";
import { query } from "@/lib/db";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "Flights Dhaka to Dubai – TripMate" };
export const dynamic = "force-dynamic";

const AIRPORTS = [
  { code: "DXB", name: "Dubai International Airport", note: "Closest to Downtown, Deira and the Marina by metro/taxi. Busiest hub with the most schedule options." },
  { code: "DWC", name: "Al Maktoum International Airport", note: "Southern Dubai (Dubai South). Often lower fares, but a longer transfer into the city." },
];

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  let stats = {};
  try {
    const { rows } = await query("SELECT destination_code, MIN(estimated_price_bdt) AS min_price, ROUND(AVG(duration_minutes))::int AS avg_min FROM flights WHERE is_active AND cabin_class='economy' GROUP BY destination_code");
    stats = Object.fromEntries(rows.map((r) => [r.destination_code, r]));
  } catch {}
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">Flights from Dhaka to Dubai</h1>
      <p className="mt-2 max-w-2xl text-navy/70">Search sample flights, compare the two Dubai airports, then send a booking request. A ticket is issued only after our team confirms your booking.</p>
      <div className="mt-8"><FlightExplorer initial={sp} /></div>
      <h2 className="mt-14 text-2xl font-bold">Compare airports</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {AIRPORTS.map((a) => (
          <div key={a.code} className="card p-5"><p className="text-xs font-semibold text-ocean">DAC → {a.code}</p><h3 className="mt-1 text-lg font-bold">{a.name}</h3>
            <p className="mt-2 text-sm text-navy/70">{a.note}</p>
            {stats[a.code] && <p className="mt-3 text-sm">Sample economy from <b className="text-ocean">{formatBDT(stats[a.code].min_price)}</b> · about {Math.floor(stats[a.code].avg_min / 60)}h {stats[a.code].avg_min % 60}m</p>}</div>))}
      </div>
    </div>
  );
}
