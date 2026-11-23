'use client';

import React, { useState } from 'react';
import FlightSearchWidget from '../../components/FlightSearchWidget';
import BookingModal from '../../components/BookingModal';
import { Plane, Info, Check, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';

export default function FlightsPage() {
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    itemName: 'Biman Bangladesh Airlines (DAC ➔ DXB)',
    priceBDT: 46000,
    travelers: 1,
    route: 'DAC ➔ DXB'
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12 max-w-7xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Plane className="w-4 h-4 text-ocean" />
          <span>Dhaka to Dubai Flight Hub</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Find & Compare Flights to Dubai
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Compare scheduled departures from Dhaka Hazrat Shahjalal International Airport (DAC) to Dubai International Airport (DXB) and Al Maktoum International Airport (DWC).
        </p>
      </div>

      {/* Flight Search Widget */}
      <FlightSearchWidget
        onSelectFlight={(flight) => {
          setBookingModalState({
            isOpen: true,
            itemName: `${flight.airline} Flight ${flight.flightNumber} (${flight.origin} ➔ ${flight.destination})`,
            priceBDT: flight.economyPriceBDT,
            travelers: flight.travelers || 1,
            route: `${flight.origin} ➔ ${flight.destination}`
          });
        }}
      />

      {/* DXB vs DWC Detailed Airport Comparison Guide */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 text-ocean text-xs font-bold uppercase tracking-wider mb-2">
          <Info className="w-4 h-4" />
          <span>Dubai Airport Decision Guide</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy mb-4">
          Which Airport Should You Choose? DXB vs. DWC
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-4xl">
          Dubai is served by two international airports. Depending on your hotel location in Dubai and your travel budget, choosing the right arrival airport can save you both money and transit time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DXB Card */}
          <div className="bg-gradient-to-br from-gray-50 to-teal/5 rounded-2xl p-6 border-2 border-ocean/30 relative">
            <div className="inline-block px-3 py-1 rounded-full bg-ocean text-white text-xs font-extrabold mb-3">
              Most Popular & Centrally Located
            </div>
            <h3 className="text-xl font-black text-navy mb-1">Dubai International Airport (DXB)</h3>
            <p className="text-xs text-gray-500 mb-4">Code: DXB • Location: Garhoud / Deira (Central Dubai)</p>

            <ul className="space-y-3 text-xs md:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Prime City Proximity:</strong> Only 10-15 minutes by taxi or direct Metro to Downtown Dubai, Burj Khalifa, and Deira.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Direct Dubai Metro Red Line:</strong> Step straight from Terminal 1 or 3 onto the air-conditioned Metro.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Major Carriers:</strong> Primary hub for Emirates Airlines and Biman Bangladesh Airlines with multiple daily flights.</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
              Best for: First-time travelers staying in Downtown Dubai, Deira, Bur Dubai, or Business Bay.
            </div>
          </div>

          {/* DWC Card */}
          <div className="bg-gradient-to-br from-gray-50 to-teal/5 rounded-2xl p-6 border-2 border-teal/50 relative">
            <div className="inline-block px-3 py-1 rounded-full bg-teal text-navy text-xs font-extrabold mb-3">
              Budget-Friendly & Modern
            </div>
            <h3 className="text-xl font-black text-navy mb-1">Al Maktoum International Airport (DWC)</h3>
            <p className="text-xs text-gray-500 mb-4">Code: DWC • Location: Dubai South / Jebel Ali</p>

            <ul className="space-y-3 text-xs md:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Lower Airfares:</strong> Typically ৳4,000 – ৳8,000 cheaper round-trip compared to DXB.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Fast Immigration & Baggage:</strong> Less crowded terminal with minimal waiting queues.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Close to Dubai South & Marina:</strong> Ideal if your hotel is in Dubai Marina, JBR, Palm Jumeirah, or Expo City.</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
              Best for: Budget-conscious travelers, Flydubai / US-Bangla seasonal charters, and stays in Dubai Marina.
            </div>
          </div>
        </div>
      </div>

      {/* Baggage & Travel Requirements for Bangladeshi Citizens */}
      <div className="bg-navy text-white rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal" />
          <span>Essential Travel Information for Bangladeshi Citizens</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs md:text-sm text-white/80">
          <div>
            <h4 className="font-bold text-teal mb-1">UAE Tourist Visa</h4>
            <p>Bangladeshi passport holders require a valid tourist visa prior to departure. 30-day or 60-day single entry visas can be arranged through TripMate as an add-on.</p>
          </div>
          <div>
            <h4 className="font-bold text-teal mb-1">Standard Baggage Allowance</h4>
            <p>Economy class fares on DAC-DXB routes typically include 30kg to 35kg checked baggage plus 7kg cabin baggage. Check exact airline ticket rules.</p>
          </div>
          <div>
            <h4 className="font-bold text-teal mb-1">Passport Validity</h4>
            <p>Your passport must be valid for a minimum of 6 months from your intended date of entry into the United Arab Emirates.</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ ...bookingModalState, isOpen: false })}
        initialBookingType="FLIGHT"
        initialItemName={bookingModalState.itemName}
        initialPriceBDT={bookingModalState.priceBDT}
        initialTravelers={bookingModalState.travelers}
        initialRoute={bookingModalState.route}
      />
    </div>
  );
}
