import { ATTRACTION_BY_SLUG, ATTRACTIONS } from "@/lib/dubai";
import { nightsBetween, roomsFor } from "@/lib/pricing";

// Configurable estimate assumptions (BDT). These are demo values, not live prices.
export const CONFIG = {
  foodPerPersonPerDay: 3200,
  transportPerPersonPerDay: 1100,
  miscRate: 0.08, // SIM, tips, small purchases
  fallbackFlight: { DXB: 50000, DWC: 45000 },
  fallbackHotel: { budget: 7500, standard: 14000, premium: 25000, luxury: 48000 },
  slightlyOverFactor: 1.1,
};

export function estimateTrip(input, { flights, hotels, packages }) {
  const nights = nightsBetween(input.departure_date, input.return_date);
  const days = nights + 1;
  const t = input.travelers;
  const rooms = roomsFor(t);

  const eco = flights.filter((f) => f.destination_code === input.airport_code && f.cabin_class === "economy");
  const flightEach = eco.length ? eco.reduce((s, f) => s + Number(f.estimated_price_bdt), 0) / eco.length : CONFIG.fallbackFlight[input.airport_code];
  const inCat = hotels.filter((h) => h.category === input.hotel_category);
  const nightly = inCat.length ? inCat.reduce((s, h) => s + Number(h.price_per_night_bdt), 0) / inCat.length : CONFIG.fallbackHotel[input.hotel_category];

  const chosen = input.activities.map((s) => ATTRACTION_BY_SLUG[s]).filter(Boolean);
  const b = {
    flights: Math.round(flightEach * t),
    hotel: Math.round(nightly * nights * rooms),
    food: CONFIG.foodPerPersonPerDay * t * days,
    transport: CONFIG.transportPerPersonPerDay * t * days,
    attractions: chosen.reduce((s, a) => s + a.cost, 0) * t,
  };
  const sub = Object.values(b).reduce((s, n) => s + n, 0);
  b.misc = Math.round(sub * CONFIG.miscRate);
  const total = sub + b.misc;
  const remaining = input.budget_bdt - total;
  const status = total <= input.budget_bdt ? "within" : total <= input.budget_bdt * CONFIG.slightlyOverFactor ? "slightly_over" : "over";

  const hotelRecs = [...inCat].sort((a, b2) => a.price_per_night_bdt - b2.price_per_night_bdt).slice(0, 3);
  const free = ATTRACTIONS.filter((a) => a.cost === 0 && !input.activities.includes(a.slug));
  const suggested = (status === "within" ? ATTRACTIONS.filter((a) => !input.activities.includes(a.slug)) : free).slice(0, 3);
  const pkgRecs = packages
    .filter((p) => p.airport_code === input.airport_code)
    .map((p) => ({ ...p, total: Number(p.price_per_person_bdt) * t, fits: Number(p.price_per_person_bdt) * t <= input.budget_bdt }))
    .sort((a, b2) => Number(b2.fits) - Number(a.fits) || a.total - b2.total)
    .slice(0, 3);

  // Daily itinerary: arrival, attractions spread across middle days, departure.
  const itinerary = [];
  const mid = Math.max(days - 2, 0);
  for (let d = 1; d <= Math.min(days, 14); d++) {
    if (d === 1) itinerary.push({ day: d, title: "Arrival in Dubai", items: [`Land at ${input.airport_code}`, "Hotel check-in and rest", "Evening walk at your hotel's area"] });
    else if (d === days) itinerary.push({ day: d, title: "Departure", items: ["Check out", "Last-minute shopping", `Transfer to ${input.airport_code}`] });
    else {
      const per = chosen.length ? Math.ceil(chosen.length / Math.max(mid, 1)) : 0;
      const slice = chosen.slice((d - 2) * per, (d - 2) * per + per);
      itinerary.push({ day: d, title: slice.length ? slice.map((a) => a.name).join(" + ") : "Free day", items: slice.length ? slice.map((a) => `${a.name} (${a.duration})`) : ["Relax, explore nearby, or add an activity"] });
    }
  }
  return { nights, travelers: t, rooms, budget: input.budget_bdt, breakdown: b, total, perPerson: Math.round(total / t), remaining, status,
    recommendations: { hotels: hotelRecs, attractions: [...chosen, ...suggested.map((a) => ({ ...a, suggested: true }))], packages: pkgRecs }, itinerary };
}
