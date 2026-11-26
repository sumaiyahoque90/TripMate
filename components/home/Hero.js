import Link from "next/link";
import FlightSearchWidget from "./FlightSearchWidget";

export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundColor: "#123047", backgroundImage: "linear-gradient(180deg,rgba(18,48,71,.55),rgba(18,48,71,.85)), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2000')" }} aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <p className="mb-4 inline-block rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-navy">Dhaka to Dubai · quotes confirmed by our team</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl">Your Journey, Your Budget, Your Adventure.</h1>
        <p className="mt-5 max-w-xl text-lg text-white/85">Book your Dubai flight, find your perfect hotel, and plan your dream vacation with TripMate.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/flights" className="btn-primary">Book Flights</Link>
          <Link href="/planner" className="btn-light">Plan Your Trip</Link>
          <Link href="/destinations" className="btn-outline">Explore Dubai</Link>
        </div>
        <div className="mt-10 max-w-fit rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
          Review &amp; Save 20% — submit three approved reviews and unlock a partner hotel voucher. <Link href="/rewards" className="font-semibold underline">How it works</Link>
        </div>
      </div>
      <div className="relative mx-auto -mb-16 max-w-6xl px-4 sm:px-6"><FlightSearchWidget /></div>
    </section>
  );
}
