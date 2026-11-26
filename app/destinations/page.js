import Link from "next/link";
import DestinationGrid from "@/components/home/DestinationGrid";
import { ATTRACTIONS, GUIDE } from "@/lib/dubai";

export const metadata = { title: "Explore Dubai – TripMate" };

export default function Page() {
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">Explore Dubai</h1>
      <p className="mb-8 mt-2 max-w-2xl text-navy/70">Eight places to start with. Costs are demo estimates per person; always confirm current prices and opening hours.</p>
      <DestinationGrid items={ATTRACTIONS} />
      <h2 className="mt-14 text-2xl font-bold">Dubai travel guide</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card p-5"><h3 className="font-bold">Best time to visit</h3><p className="mt-2 text-sm text-navy/80">{GUIDE.bestTime}</p></div>
        <div className="card p-5"><h3 className="font-bold">Local transportation</h3><p className="mt-2 text-sm text-navy/80">{GUIDE.transport}</p></div>
        <div className="card p-5"><h3 className="font-bold">Popular activities</h3><ul className="mt-2 list-disc pl-5 text-sm text-navy/80">{GUIDE.activities.map((a) => <li key={a}>{a}</li>)}</ul></div>
        <div className="card p-5"><h3 className="font-bold">General tips</h3><ul className="mt-2 list-disc pl-5 text-sm text-navy/80">{GUIDE.tips.map((a) => <li key={a}>{a}</li>)}</ul></div>
      </div>
      <div className="mt-10"><Link href="/planner" className="btn-primary">Plan a trip around these places</Link></div>
    </div>
  );
}
