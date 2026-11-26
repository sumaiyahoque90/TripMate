// Pure pricing helpers shared by the server (authoritative) and the booking form (preview only).
export const ROOM_SIZE = 2;

export function nightsBetween(dep, ret) {
  if (!dep || !ret) return 0;
  const d = Math.round((new Date(ret) - new Date(dep)) / 86400000);
  return d > 0 ? d : 0;
}
export const roomsFor = (travelers) => Math.max(1, Math.ceil(Number(travelers || 1) / ROOM_SIZE));

export function hotelCharge({ hotel, roomType, nights, travelers }) {
  const extra = Number((hotel.room_types || []).find((r) => r.name === roomType)?.extra || 0);
  return (Number(hotel.price_per_night_bdt) + extra) * nights * roomsFor(travelers);
}

// Returns { total, hotelSubtotal } (total null when it cannot be estimated, e.g. quotation-only flight).
export function computeBookingTotal({ type, flight, hotel, pkg, planTotal, travelers, nights, roomType }) {
  const t = Number(travelers || 1);
  if (type === "flight") return { total: flight ? Number(flight.estimated_price_bdt) * t : null, hotelSubtotal: 0 };
  if (type === "hotel") {
    if (!hotel || !nights) return { total: null, hotelSubtotal: 0 };
    const h = hotelCharge({ hotel, roomType, nights, travelers: t });
    return { total: h, hotelSubtotal: h };
  }
  if (type === "package") return { total: pkg ? Number(pkg.price_per_person_bdt) * t : null, hotelSubtotal: 0 };
  if (type === "personalized") return { total: planTotal ?? null, hotelSubtotal: 0 };
  return { total: null, hotelSubtotal: 0 };
}
