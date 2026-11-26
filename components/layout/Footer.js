import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-xl font-bold text-white">TripMate</p>
          <p className="mt-2 text-sm">Your Journey, Your Budget, Your Adventure.</p>
          <p className="mt-4 text-xs text-white/60">Booking requests are confirmed by our team. Prices shown are estimates unless stated otherwise.</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Explore</p>
          <ul className="space-y-1.5">
            {[["/flights","Flights"],["/hotels","Hotels"],["/destinations","Dubai guide"],["/planner","Trip planner"],["/rewards","Travel Rewards"]].map(([h,l]) => <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>)}
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Support</p>
          <ul className="space-y-1.5">
            <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
            <li>Email: support@your-domain.example</li>
            <li>Phone: +880-XXXX-XXXXXX</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">© {new Date().getFullYear()} TripMate. Demo platform.</div>
    </footer>
  );
}
