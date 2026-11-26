import HotelExplorer from "@/components/hotels/HotelExplorer";
import { query } from "@/lib/db";

export const metadata = { title: "Dubai Hotels – TripMate" };
export const dynamic = "force-dynamic";

export default async function Page() {
  let hotels = [];
  try { hotels = (await query("SELECT id,name,location,category,price_per_night_bdt,facilities,description,image_url,is_partner FROM hotels WHERE is_active ORDER BY price_per_night_bdt")).rows; } catch {}
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">Dubai hotels</h1>
      <p className="mb-8 mt-2 max-w-2xl text-navy/70">From budget stays to beachfront luxury. Hotel data and prices here are sample estimates; our team confirms real rates and availability.</p>
      <HotelExplorer initialHotels={hotels} />
    </div>
  );
}
