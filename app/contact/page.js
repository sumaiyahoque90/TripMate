import ContactForm from "@/components/ui/ContactForm";
import { LifeBuoy, Mail, Phone } from "lucide-react";

export const metadata = { title: "Contact – TripMate" };

export default function Page() {
  return (
    <div className="section">
      <h1 className="text-4xl font-bold">Contact & support</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ContactForm />
        <aside className="space-y-4">
          <div className="card p-5 text-sm"><p className="flex items-center gap-2 font-bold"><LifeBuoy size={18} className="text-ocean" />Customer support</p><p className="mt-2 text-navy/70">Questions about a booking? Include your reference (TM-XXXXXX) so we can find it quickly.</p></div>
          <div className="card p-5 text-sm"><p className="flex items-center gap-2"><Mail size={16} className="text-ocean" />support@your-domain.example <span className="text-xs text-navy/50">(placeholder)</span></p><p className="mt-2 flex items-center gap-2"><Phone size={16} className="text-ocean" />+880-XXXX-XXXXXX <span className="text-xs text-navy/50">(placeholder)</span></p>
            <p className="mt-3 text-xs text-navy/50">Social: Facebook, Instagram, LinkedIn. Links to be added by the site owner.</p></div>
          <div className="card divide-y divide-slate-100 text-sm">
            {[["How long does confirmation take?", "Our team reviews requests and replies by email. Timing depends on the request."], ["Can I change a booking?", "Cancel a pending request from your dashboard, or contact us for confirmed bookings."], ["Is payment taken online?", "No. This version does not process payments."]].map(([q, a]) => <details key={q} className="p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-navy/70">{a}</p></details>)}
          </div>
        </aside>
      </div>
    </div>
  );
}
