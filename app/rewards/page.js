import Link from "next/link";
import RewardProgress from "@/components/rewards/RewardProgress";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { getProgress, getSettings } from "@/lib/rewards";

export const metadata = { title: "TripMate Travel Rewards – Review & Save 20%" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  const settings = await getSettings({ query }).catch(() => null);
  const progress = user && settings ? await getProgress({ query }, user.id).catch(() => null) : null;
  const pct = settings?.discount_percent ?? 20, need = settings?.reviews_required ?? 3;
  const steps = ["Complete a booking through TripMate.", "After your trip or stay is marked completed, review it.", `Submit ${need} separate reviews for ${need} completed bookings.`, "Our team approves your reviews.", `A unique ${pct}% voucher is generated automatically.`, "Use it once on an eligible partner hotel booking."];
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">TripMate Travel Rewards</h1>
      <p className="mt-1 font-display text-2xl text-ocean">Review &amp; Save {pct}%</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-xl font-bold">How it works</h2>
          <ol className="mt-4 space-y-3">{steps.map((t, i) => <li key={i} className="flex gap-3 text-sm"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-soft font-bold">{i + 1}</span><span className="pt-1">{t}</span></li>)}</ol>
          <h2 className="mt-8 text-xl font-bold">Fair-play rules</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-navy/80">
            <li>Reviews must come from genuine customers and be linked to a completed booking. One review per booking.</li>
            <li>Your rating never affects the reward. Honest feedback, positive or negative, counts the same once approved.</li>
            <li>The voucher applies to hotel accommodation charges only, not flights, taxes or other services.</li>
            <li>One voucher, one redemption, with an expiry date.</li>
          </ul>
          {settings && (<>
            <h2 className="mt-8 text-xl font-bold">Current partner hotel</h2>
            <div className="card mt-3 p-5 text-sm">
              <p className="font-bold">{settings.partner_hotel_name || "Not configured yet"}</p>
              {settings.partner_hotel_location && <p className="text-navy/60">{settings.partner_hotel_location}</p>}
              <p className="mt-2">Discount: {pct}% · Voucher valid for {settings.voucher_valid_days} days</p>
              {settings.eligible_room_types?.length > 0 && <p>Eligible rooms: {settings.eligible_room_types.join(", ")}</p>}
              {settings.conditions && <p className="mt-2 text-navy/70">{settings.conditions}</p>}
              <p className="mt-3 text-xs text-navy/50">This is a demonstration partner hotel. It does not represent an actual commercial partnership.</p>
            </div></>)}
        </div>
        <div>
          {progress ? <RewardProgress progress={progress} /> : (
            <div className="card p-6"><p className="font-bold">Track your progress</p><p className="mt-1 text-sm text-navy/70">Sign in to see your review progress and vouchers.</p><div className="mt-4 flex gap-3"><Link href="/login?next=/rewards" className="btn-primary">Sign in</Link><Link href="/register" className="btn-light border border-slate-200">Create account</Link></div></div>)}
        </div>
      </div>
    </div>
  );
}
