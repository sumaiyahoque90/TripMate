// End-to-end API test. Usage: BASE=http://localhost:3100 ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/e2e-test.mjs
const BASE = process.env.BASE || "http://localhost:3000";
const ADMIN = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
let pass = 0, failN = 0;
const check = (name, cond, extra) => { if (cond) { pass++; console.log("  ✓", name); } else { failN++; console.log("  ✗", name, extra !== undefined ? JSON.stringify(extra) : ""); } };

function client() {
  let cookie = "";
  return async (method, path, body) => {
    const res = await fetch(BASE + path, { method, headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const sc = res.headers.get("set-cookie"); if (sc) cookie = sc.split(";")[0];
    let data = null; try { data = await res.json(); } catch {}
    return { status: res.status, data };
  };
}
const day = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const stamp = Date.now();
const anon = client(), cust = client(), other = client(), admin = client();

console.log("Public data");
let r = await anon("GET", "/api/hotels"); check("hotels list", r.status === 200 && r.data.hotels.length >= 6);
const partner = r.data.hotels.find((h) => h.is_partner);
const budgetHotel = r.data.hotels.find((h) => h.category === "budget");
check("category filter", (await anon("GET", "/api/hotels?category=luxury")).data.hotels.every((h) => h.category === "luxury"));
check("SQL-injection-ish filter is harmless", (await anon("GET", "/api/hotels?location=" + encodeURIComponent("x'; DROP TABLE users;--"))).status === 200);
r = await anon("GET", "/api/flights?airport=DWC"); check("flights DWC only", r.data.flights.length > 0 && r.data.flights.every((f) => f.destination_code === "DWC"));
const dxbFlight = (await anon("GET", "/api/flights?airport=DXB")).data.flights.find((f) => f.cabin_class === "economy");
const pr = await anon("GET", "/api/hotels/" + partner.id); check("hotel detail", pr.status === 200 && pr.data.hotel.room_types.length > 0);
const room = pr.data.hotel.room_types[0].name;
check("hotel 404", (await anon("GET", "/api/hotels/999999")).status === 404);

console.log("Auth & authorization");
check("unauth booking → 401", (await anon("POST", "/api/bookings", {})).status === 401);
check("unauth admin → 401", (await anon("GET", "/api/admin/dashboard")).status === 401);
const email = `cust${stamp}@example.com`;
check("weak password rejected", (await cust("POST", "/api/auth/register", { full_name: "Test Customer", email, password: "123" })).status === 400);
r = await cust("POST", "/api/auth/register", { full_name: "Test Customer", email, phone: "+8801700000000", password: "Passw0rd!x" });
check("register", r.status === 201 && r.data.user.role === "customer");
check("duplicate email → 409", (await anon("POST", "/api/auth/register", { full_name: "X Y", email, password: "Passw0rd!x" })).status === 409);
check("bad login → 401", (await anon("POST", "/api/auth/login", { email, password: "wrongwrong" })).status === 401);
check("customer → admin API 403", (await cust("GET", "/api/admin/dashboard")).status === 403);
check("customer cannot self-promote via register", (await other("POST", "/api/auth/register", { full_name: "Other User", email: `o${stamp}@example.com`, password: "Passw0rd!x", role: "admin" })).data.user.role === "customer");
r = await admin("POST", "/api/auth/login", ADMIN); check("admin login", r.status === 200 && r.data.user.role === "admin");

console.log("Flight search & booking");
check("search rejects past date", (await anon("POST", "/api/flights/search", { airport: "DXB", departure: "2020-01-01", travelers: 1 })).status === 400);
r = await anon("POST", "/api/flights/search", { airport: "DXB", departure: day(30), return: day(37), travelers: 2, cabin: "economy" });
check("search returns sample flights with totals", r.status === 200 && r.data.flights[0].estimated_total_bdt === Number(r.data.flights[0].estimated_price_bdt) * 2);
const base = { full_name: "Test Customer", email, phone: "+8801700000000" };
r = await cust("POST", "/api/flights/bookings", { ...base, flight_id: dxbFlight.id, airport_code: "DXB", departure_date: day(30), return_date: day(37), travelers: 2, passengers: [{ full_name: "Test Customer" }, { full_name: "Second Pax" }] });
check("flight booking pending + reference", r.status === 201 && r.data.booking.status === "pending" && /^TM-[A-Z0-9]{6}$/.test(r.data.booking.reference), r.data);
check("server-computed total", Number(r.data.booking.estimated_total_bdt) === Number(dxbFlight.estimated_price_bdt) * 2);
const flightBk = r.data.booking;
check("airport mismatch rejected", (await cust("POST", "/api/flights/bookings", { ...base, flight_id: dxbFlight.id, airport_code: "DWC", departure_date: day(30), travelers: 1 })).status === 400);
check("quotation-only flight request (no flight chosen)", (await cust("POST", "/api/flights/bookings", { ...base, airport_code: "DWC", departure_date: day(31), travelers: 1 })).status === 201);
check("invalid form → 400 with field errors", (await cust("POST", "/api/bookings", { type: "flight", full_name: "", email: "bad", phone: "1", travelers: 0 })).data.errors?.email);

console.log("Hotel/package/personalized bookings");
r = await cust("POST", "/api/hotels/bookings", { ...base, hotel_id: budgetHotel.id, room_type: "Standard Double", departure_date: day(30), return_date: day(33), travelers: 2 });
check("hotel booking total = price*nights*rooms", r.status === 201 && Number(r.data.booking.estimated_total_bdt) === Number(budgetHotel.price_per_night_bdt) * 3, r.data);
const hotelBk = r.data.booking;
const pk = (await anon("GET", "/api/hotels")).data; 
r = await cust("POST", "/api/bookings", { ...base, type: "package", package_id: 1, departure_date: day(40), travelers: 2 });
check("package booking", r.status === 201 && r.data.booking.airport_code, r.data);
const pkgBk = r.data.booking;
const tripIn = { airport_code: "DXB", departure_date: day(50), return_date: day(55), travelers: 2, budget_bdt: 300000, hotel_category: "standard", activities: ["burj-khalifa", "desert-safari", "dubai-mall"], preferences: "family friendly" };
r = await anon("POST", "/api/trips/estimate", tripIn);
const e = r.data.estimate;
check("planner estimate shape", r.status === 200 && e.total > 0 && e.perPerson === Math.round(e.total / 2) && e.itinerary.length === 6 && e.recommendations.hotels.length > 0, e && Object.keys(e));
check("planner breakdown sums to total", Object.values(e.breakdown).reduce((s, n) => s + n, 0) === e.total);
check("planner status within budget", e.status === "within" && e.remaining === 300000 - e.total);
check("planner over budget status", (await anon("POST", "/api/trips/estimate", { ...tripIn, budget_bdt: 20000 })).data.estimate.status === "over");
check("planner slightly over", (await anon("POST", "/api/trips/estimate", { ...tripIn, budget_bdt: Math.ceil(e.total / 1.05) })).data.estimate.status === "slightly_over");
check("planner bad input 400", (await anon("POST", "/api/trips/estimate", { ...tripIn, budget_bdt: -5 })).status === 400);
check("save trip needs login", (await anon("POST", "/api/trips", tripIn)).status === 401);
r = await cust("POST", "/api/trips", tripIn); check("save trip", r.status === 201 && r.data.plan_id);
const planId = r.data.plan_id;
r = await cust("POST", "/api/bookings", { ...base, type: "personalized", trip_plan_id: planId });
check("personalized booking uses plan total", r.status === 201 && Number(r.data.booking.estimated_total_bdt) === e.total, r.data);
const persBk = r.data.booking;
check("plan cannot be booked twice → 409", (await cust("POST", "/api/bookings", { ...base, type: "personalized", trip_plan_id: planId })).status === 409);

console.log("Booking access control & status workflow");
check("other user cannot read booking", (await other("GET", `/api/bookings/${flightBk.id}`)).status === 404);
check("owner can read booking", (await cust("GET", `/api/bookings/${flightBk.id}`)).data.booking.passengers.length === 2);
check("list own bookings", (await cust("GET", "/api/bookings")).data.bookings.length >= 5);
check("review before completion → 409", (await cust("POST", "/api/reviews", { booking_id: flightBk.id, rating: 5, comment: "Great trip overall, loved it." })).status === 409);
check("customer cannot confirm", (await cust("PATCH", `/api/bookings/${flightBk.id}/status`, { status: "confirmed" })).status === 403);
check("pending→completed invalid", (await admin("PATCH", `/api/bookings/${flightBk.id}/status`, { status: "completed" })).status === 409);
for (const b of [flightBk, hotelBk, pkgBk, persBk]) {
  await admin("PATCH", `/api/bookings/${b.id}/status`, { status: "confirmed" });
  r = await admin("PATCH", `/api/bookings/${b.id}/status`, { status: "completed" });
}
check("admin confirms then completes", r.data.booking.status === "completed");
check("completed cannot be cancelled", (await admin("PATCH", `/api/bookings/${flightBk.id}/status`, { status: "cancelled" })).status === 409);
const cancelMe = (await cust("POST", "/api/flights/bookings", { ...base, airport_code: "DXB", departure_date: day(60), travelers: 1 })).data.booking;
check("customer cancels own pending", (await cust("PATCH", `/api/bookings/${cancelMe.id}/status`, { status: "cancelled" })).data.booking.status === "cancelled");

console.log("Reviews & rewards");
check("short review rejected", (await cust("POST", "/api/reviews", { booking_id: flightBk.id, rating: 5, comment: "short" })).status === 400);
check("other user cannot review my booking", (await other("POST", "/api/reviews", { booking_id: flightBk.id, rating: 5, comment: "I never took this trip at all." })).status === 404);
const ratings = [1, 3, 5];
const bks = [flightBk, hotelBk, pkgBk];
for (let i = 0; i < 3; i++) {
  r = await cust("POST", "/api/reviews", { booking_id: bks[i].id, rating: ratings[i], title: `Review ${i + 1} ${stamp}`, comment: `Genuine feedback number ${i + 1} about the whole experience.` });
  check(`submit review ${i + 1} (rating ${ratings[i]})`, r.status === 201 && r.data.review.status === "pending", r.data);
}
check("duplicate review → 409", (await cust("POST", "/api/reviews", { booking_id: flightBk.id, rating: 4, comment: "Trying to review the same booking twice." })).status === 409);
check("customer cannot approve", (await cust("PATCH", "/api/reviews/1/approval", { status: "approved" })).status === 403);
let prog = (await cust("GET", "/api/rewards/progress")).data.progress;
check("progress 0/3, 3 awaiting", prog.completed === 0 && prog.pending === 3 && prog.slots.every((s) => s.status === "awaiting_approval"), prog);
check("public reviews empty before approval", !(await anon("GET", "/api/reviews")).data.reviews.some((x) => x.title?.includes(String(stamp))));
const pending = (await admin("GET", "/api/admin/reviews?status=pending")).data.reviews.filter((x) => x.email === email);
check("admin sees 3 pending", pending.length === 3);
r = await admin("PATCH", `/api/reviews/${pending[0].id}/approval`, { status: "approved" });
check("approve 1: no voucher", r.status === 200 && r.data.vouchers_issued.length === 0);
r = await admin("PATCH", `/api/reviews/${pending[1].id}/approval`, { status: "approved" });
prog = (await cust("GET", "/api/rewards/progress")).data.progress;
check("progress 2/3, no voucher yet", prog.completed === 2 && prog.vouchers.length === 0 && !prog.unlocked, prog);
check("double approval → 409", (await admin("PATCH", `/api/reviews/${pending[1].id}/approval`, { status: "approved" })).status === 409);
r = await admin("PATCH", `/api/reviews/${pending[2].id}/approval`, { status: "approved" });
check("approve 3 issues voucher TRIPMATE20-XXXXX", r.data.vouchers_issued.length === 1 && /^TRIPMATE20-[A-Z0-9]{5}$/.test(r.data.vouchers_issued[0]), r.data);
const code = r.data.vouchers_issued[0];
prog = (await cust("GET", "/api/rewards/progress")).data.progress;
check("progress unlocked", prog.unlocked && prog.vouchers[0].status === "active");
check("approved reviews public (author name abbreviated)", (await anon("GET", "/api/reviews")).data.reviews.some((x) => x.author === "Test C."));
check("approving again does not duplicate voucher", (await cust("GET", "/api/rewards/vouchers")).data.vouchers.length === 1);

console.log("Voucher validation & redemption");
const hdates = { departure_date: day(70), return_date: day(73), travelers: 2 };
check("voucher invalid for other hotel", (await cust("POST", "/api/rewards/validate", { code, hotel_id: budgetHotel.id, room_type: "Standard Double", ...hdates })).status === 400);
check("voucher invalid for ineligible room", (await cust("POST", "/api/rewards/validate", { code, hotel_id: partner.id, room_type: "Nonexistent", ...hdates })).status === 400);
check("another customer cannot use my voucher", await (async () => { await other("POST", "/api/auth/login", { email: `o${stamp}@example.com`, password: "Passw0rd!x" }); return (await other("POST", "/api/rewards/validate", { code, hotel_id: partner.id, room_type: room, ...hdates })).status === 400; })());
r = await cust("POST", "/api/rewards/validate", { code, hotel_id: partner.id, room_type: room, ...hdates });
const expected = Number(partner.price_per_night_bdt) * 3;
check("validate gives 20% of hotel subtotal", r.status === 200 && r.data.discount_bdt === Math.round(expected * 0.2) && r.data.hotel_subtotal_bdt === expected, r.data);
// concurrency: two simultaneous bookings with the same voucher → exactly one wins
const attempt = () => cust("POST", "/api/hotels/bookings", { ...base, hotel_id: partner.id, room_type: room, voucher_code: code, ...hdates });
const [a, b] = await Promise.all([attempt(), attempt()]);
const winners = [a, b].filter((x) => x.status === 201);
check("one-time redemption holds under concurrency", winners.length === 1 && [a, b].some((x) => x.status === 400 || x.status === 409), [a.status, b.status]);
const vb = winners[0].data.booking;
check("discount applied on hotel charge only", Number(vb.discount_bdt) === Math.round(expected * 0.2) && Number(vb.estimated_total_bdt) === expected - Math.round(expected * 0.2), vb);
check("voucher now redeemed", (await cust("GET", "/api/rewards/vouchers")).data.vouchers[0].status === "redeemed");
check("redeemed voucher rejected", (await cust("POST", "/api/hotels/bookings", { ...base, hotel_id: partner.id, room_type: room, voucher_code: code, ...hdates })).status === 400);
check("voucher on flight booking rejected", (await cust("POST", "/api/bookings", { ...base, type: "flight", airport_code: "DXB", departure_date: day(30), travelers: 1, voucher_code: code })).status === 400);
r = await admin("PATCH", `/api/bookings/${vb.id}/status`, { status: "cancelled" });
check("cancelling voucher booking restores voucher", r.status === 200 && (await cust("GET", "/api/rewards/vouchers")).data.vouchers[0].status === "active");
const plain = (await cust("POST", "/api/hotels/bookings", { ...base, hotel_id: partner.id, room_type: room, ...hdates })).data.booking;
r = await cust("POST", "/api/rewards/redeem", { code, booking_id: plain.id });
check("redeem endpoint applies voucher to pending booking", r.status === 200 && Number(r.data.booking.discount_bdt) === Math.round(expected * 0.2), r.data);
check("second redeem → error", (await cust("POST", "/api/rewards/redeem", { code, booking_id: plain.id })).status >= 400);
check("admin sees redeemed voucher", (await admin("GET", "/api/admin/rewards")).data.vouchers.some((v) => v.code === code && v.status === "redeemed"));
check("admin can update reward settings", (await admin("PUT", "/api/admin/rewards", { partner_hotel_id: partner.id, reviews_required: 3, discount_percent: 20, voucher_valid_days: 180, eligible_room_types: [room, "Deluxe Twin"], conditions: "Demo" })).status === 200);

console.log("Contact & admin");
check("contact invalid → 400", (await anon("POST", "/api/contact", { name: "A", email: "x", message: "hi" })).status === 400);
check("contact stored", (await anon("POST", "/api/contact", { name: "Visitor", email: "v@example.com", subject: "Hi", message: "Question about Dubai trips please." })).status === 201);
check("admin reads messages", (await admin("GET", "/api/admin/messages")).data.messages.some((m) => m.email === "v@example.com"));
const st = (await admin("GET", "/api/admin/dashboard")).data.stats;
check("dashboard stats", st.customers >= 1 && st.completed >= 4 && st.vouchers >= 1 && st.total_reviews >= 3 && st.redeemed >= 1, st);
check("admin bookings list", (await admin("GET", "/api/admin/bookings?status=completed")).data.bookings.every((b) => b.status === "completed"));
r = await admin("POST", "/api/admin/resources/hotels", { name: "Test Hotel", location: "Deira", category: "budget", price_per_night_bdt: 5000, facilities: "WiFi, Pool" });
check("admin creates hotel", r.status === 201 && r.data.row.facilities.length === 2, r.data);
check("new hotel is active by default", (await anon("GET", `/api/hotels/${r.data.row.id}`)).status === 200);
check("admin updates hotel", (await admin("PUT", `/api/admin/resources/hotels/${r.data.row.id}`, { price_per_night_bdt: 5500 })).data.row.price_per_night_bdt == 5500);
check("admin validation", (await admin("POST", "/api/admin/resources/hotels", { name: "", category: "weird" })).status === 400);
check("admin archives hotel", (await admin("DELETE", `/api/admin/resources/hotels/${r.data.row.id}`)).data.archived);
check("archived hotel hidden", (await anon("GET", `/api/hotels/${r.data.row.id}`)).status === 404);
check("customer cannot use admin CRUD", (await cust("POST", "/api/admin/resources/hotels", { name: "x" })).status === 403);
check("unknown resource 404", (await admin("GET", "/api/admin/resources/users")).status === 404);
await anon("POST", "/api/auth/logout"); 
check("logout clears session", (await (async () => { await cust("POST", "/api/auth/logout"); return cust("GET", "/api/bookings"); })()).status === 401);

console.log(`\n${pass} passed, ${failN} failed`);
process.exit(failN ? 1 : 0);
