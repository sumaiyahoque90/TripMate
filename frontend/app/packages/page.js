'use client';

import React, { useState } from 'react';
import PackageTimeline, { DUBAI_EXPLORER_PACKAGE } from '../../components/PackageTimeline';
import BookingModal from '../../components/BookingModal';
import { Sparkles, Calendar, Clock, MapPin, Users, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import Image from 'next/image';

const OTHER_PACKAGES = [
  {
    id: 'dubai-luxury-shopping-6d5n',
    title: 'Dubai Luxury & Shopping Spree',
    duration: '6 Days / 5 Nights',
    departure: 'Dhaka (DAC)',
    destination: 'Dubai (DXB)',
    basePriceBDT: 125000,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
    description: 'Indulge in 5-star beachfront luxury, helicopter city flyover, private yacht charter along Dubai Marina, and personal VIP shopping styling.',
    inclusions: ['5-Star Luxury Beach Resort', 'Return Flights DAC-DXB', 'Private Marina Yacht Tour', 'Helicopter Ride', 'Daily Buffet Breakfast']
  },
  {
    id: 'dubai-abu-dhabi-twin-7d6n',
    title: 'Dubai & Abu Dhabi Twin Wonders',
    duration: '7 Days / 6 Nights',
    departure: 'Dhaka (DAC)',
    destination: 'Dubai (DXB) & Abu Dhabi',
    basePriceBDT: 110000,
    rating: 4.8,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1512632570417-a609802970a7?auto=format&fit=crop&w=800&q=80',
    description: 'Experience both Emirates: Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, Ferrari World, followed by Burj Khalifa and desert safari.',
    inclusions: ['4-Star Stays in Dubai & Abu Dhabi', 'Inter-city Private Transfers', 'Sheikh Zayed Mosque Entry', 'Ferrari World Tickets', 'Return Flights']
  },
  {
    id: 'dubai-budget-family-4d3n',
    title: 'Dubai Budget Family Holiday',
    duration: '4 Days / 3 Nights',
    departure: 'Dhaka (DAC)',
    destination: 'Dubai (DWC / DXB)',
    basePriceBDT: 68000,
    rating: 4.7,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    description: 'Budget-optimized family getaway utilizing Al Maktoum Airport (DWC) and comfortable family apartment hotels in Deira.',
    inclusions: ['3-Star Family Apartment Stay', 'Budget Flight DAC-DWC', 'City Sightseeing Tour', 'Dubai Creek Dhow Cruise', 'Airport Transfers']
  }
];

export default function PackagesPage() {
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    itemName: 'Dhaka to Dubai – Dubai Explorer',
    priceBDT: 85000,
    travelers: 2,
    route: 'Dhaka (DAC) ➔ Dubai'
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-16 max-w-7xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-ocean" />
          <span>Curated International Packages</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Dubai Holiday Packages from Dhaka
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          All-inclusive international travel packages with return flights from Dhaka, premium hotel accommodations, world-class sightseeing, and transparent demo pricing.
        </p>
      </div>

      {/* Flagship Dubai Explorer Package with Timeline */}
      <section>
        <PackageTimeline 
          onBookPackage={(data) => {
            setBookingModalState({
              isOpen: true,
              itemName: data.packageTitle,
              priceBDT: DUBAI_EXPLORER_PACKAGE.basePriceBDT,
              travelers: data.travelers,
              route: 'Dhaka (DAC) ➔ Dubai (DXB/DWC)'
            });
          }}
        />
      </section>

      {/* Other Curated Packages */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy">
            More Popular Dubai Tour Packages
          </h2>
          <p className="text-gray-500 text-sm">
            Handcrafted for different travel styles, durations, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OTHER_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="relative h-48 w-full">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {pkg.duration}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{pkg.departure} ➔ {pkg.destination}</span>
                    <span className="text-amber-500 font-bold">★ {pkg.rating} ({pkg.reviewsCount})</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{pkg.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{pkg.description}</p>

                  <div className="space-y-1 mb-4">
                    {pkg.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Demo Price</span>
                    <span className="text-xl font-black text-ocean">৳{pkg.basePriceBDT.toLocaleString()}</span>
                    <span className="text-[11px] text-gray-500"> / person</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingModalState({
                        isOpen: true,
                        itemName: pkg.title,
                        priceBDT: pkg.basePriceBDT,
                        travelers: 2,
                        route: `${pkg.departure} ➔ ${pkg.destination}`
                      });
                    }}
                    className="px-4 py-2 bg-navy hover:bg-navy-light text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ ...bookingModalState, isOpen: false })}
        initialBookingType="PACKAGE"
        initialItemName={bookingModalState.itemName}
        initialPriceBDT={bookingModalState.priceBDT}
        initialTravelers={bookingModalState.travelers}
        initialRoute={bookingModalState.route}
      />
    </div>
  );
}
