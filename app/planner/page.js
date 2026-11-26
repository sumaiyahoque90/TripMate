import PlannerClient from "@/components/planner/PlannerClient";
export const metadata = { title: "Smart Trip Planner – TripMate" };
export default function Page() {
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">Smart budget trip planner</h1>
      <p className="mb-8 mt-2 max-w-2xl text-navy/70">Tell us your budget in BDT and what you like. We estimate flights, hotel, food, transport and activities, then build an itinerary. Change anything and recalculate.</p>
      <PlannerClient />
    </div>
  );
}
