'use client';

import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Users, CheckCircle, XCircle, 
  Plane, Hotel, Sparkles, ChevronRight, ShieldAlert, Award, Compass, Sun, Moon
} from 'lucide-react';
import Image from 'next/image';

export const DUBAI_EXPLORER_PACKAGE = {
  id: 'dubai-explorer-5d4n',
  title: 'Dhaka to Dubai – Dubai Explorer',
  duration: '5 Days / 4 Nights',
  departure: 'Dhaka, Bangladesh (DAC)',
  destination: 'Dubai, UAE (DXB / DWC)',
  basePriceBDT: 85000,
  rating: 4.9,
  reviewsCount: 142,
  image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  description: 'The ultimate signature Dubai getaway tailored for Bangladeshi travelers. Experience iconic architectural wonders including Burj Khalifa, thrilling Desert Safari dune bashing, luxury marina cruise dining, and premium 4-star hotel stays.',
  inclusions: [
    'Return flights DAC - DXB - DAC (Demo estimate)',
    '4 Nights in 4-Star Partner Hotel with Daily Breakfast',
    'Burj Khalifa "At The Top" (124th/125th floor) entry tickets',
    'Dubai City Tour with English/Bengali speaking guide',
    'Desert Safari with 4x4 Dune Bashing & BBQ Buffet Dinner',
    'Marina Dhow Cruise Dinner with live entertainment',
    'Private round-trip airport transfers (DXB or DWC)',
    'All Dubai Municipality fees and service charges'
  ],
  exclusions: [
    'UAE Tourist Visa processing fee (Available as add-on for ৳11,500)',
    'Tourism Dirham fee paid directly to hotel (approx. AED 15/night)',
    'Personal shopping, travel insurance, and optional activities'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Departure from Dhaka & Welcome to Dubai – Marina Dhow Cruise',
      icon: 'Plane',
      time: 'Day 1',
      highlights: [
        'Board your scheduled flight from Hazrat Shahjalal International Airport (DAC) in Dhaka.',
        'Touchdown at Dubai International Airport (DXB) or Al Maktoum Airport (DWC).',
        'Meet & Greet by TripMate representative and private transfer to your 4-star partner hotel.',
        'Evening luxury Dhow Cruise at Dubai Marina with international buffet dinner, tanoura dance, and illuminated skyscraper views.'
      ]
    },
    {
      day: 2,
      title: 'Dubai City Tour & Burj Khalifa "At The Top"',
      icon: 'Sun',
      time: 'Day 2',
      highlights: [
        'Delightful international breakfast at the hotel.',
        'Half-day Dubai City Tour: Dubai Frame photo stop, Zabeel Palace, Jumeirah Mosque, and Kite Beach.',
        'Afternoon at Dubai Mall – the world’s largest shopping and entertainment destination.',
        'Ascend to the 124th and 125th floors of Burj Khalifa for breathtaking 360-degree panoramic views of Dubai at sunset.',
        'Spectacular Dubai Fountain water show set to global and Arabic music.'
      ]
    },
    {
      day: 3,
      title: 'Red Dunes Desert Safari with BBQ Dinner & Shows',
      icon: 'Compass',
      time: 'Day 3',
      highlights: [
        'Morning free for relaxation, pool time, or shopping at Mall of the Emirates.',
        '2:30 PM: Pick up in luxury 4x4 Land Cruiser for the high-octane Red Dunes Desert Safari.',
        'Exhilarating dune bashing across the Lahbab desert, sandboarding, and sunset photography.',
        'Traditional Bedouin campsite: Camel riding, Henna tattooing, Arabic coffee (Gahwa), and shisha lounge.',
        'Lavish BBQ buffet dinner under the stars with live Tanoura dance, Fire show, and Belly dancing performance.'
      ]
    },
    {
      day: 4,
      title: 'Palm Jumeirah, Miracle Garden & Traditional Souks',
      icon: 'Sparkles',
      time: 'Day 4',
      highlights: [
        'Visit the world-famous Palm Jumeirah and scenic views of Atlantis The Palm.',
        'Photo stop at the architectural marvel: Museum of the Future.',
        'Seasonal excursion to Dubai Miracle Garden (over 150 million blooming flowers in full color).',
        'Traditional Abra water taxi ride across Dubai Creek to explore the glittering Gold Souk and fragrant Spice Souk.'
      ]
    },
    {
      day: 5,
      title: 'Last-minute Souvenir Shopping & Flight Back to Dhaka',
      icon: 'Plane',
      time: 'Day 5',
      highlights: [
        'Sumptuous breakfast and relaxed hotel check-out.',
        'Free time for last-minute souvenir and electronics shopping in Deira / Bur Dubai.',
        'Private transfer from hotel to Dubai Airport (DXB or DWC).',
        'Fly back to Dhaka with unforgettable memories of your dream Dubai vacation with TripMate!'
      ]
    }
  ]
};

export default function PackageTimeline({ onBookPackage }) {
  const [travelers, setTravelers] = useState(2);
  const [activeDay, setActiveDay] = useState(1);
  const pkg = DUBAI_EXPLORER_PACKAGE;

  const totalPriceBDT = pkg.basePriceBDT * travelers;

  const handleBook = () => {
    if (onBookPackage) {
      onBookPackage({
        packageId: pkg.id,
        packageTitle: pkg.title,
        travelers,
        totalPriceBDT,
        duration: pkg.duration
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
      {/* Top Banner with Image and Quick Specs */}
      <div className="relative h-80 md:h-[420px] w-full">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123047] via-[#123047]/60 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white text-xs md:text-sm font-black tracking-wide shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Most Popular International Package</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs md:text-sm font-bold border border-white/20">
            <Award className="w-4 h-4 text-amber-300" />
            <span>4.9 ★ (142 reviews)</span>
          </div>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-base text-[#D9F3EF] font-bold mb-2">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {pkg.departure}</span>
            <span>➔</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {pkg.destination}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {pkg.duration}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {pkg.title}
          </h2>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {/* Price & Traveler Calculator Bar */}
        <div className="bg-slate-50 border-2 border-gray-200 rounded-2xl p-6 md:p-8 mb-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="w-full lg:w-auto">
            <div className="text-xs md:text-sm text-gray-600 font-extrabold uppercase tracking-wider mb-1">
              Demo Estimated Package Price
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-[#087E8B]">
                ৳{pkg.basePriceBDT.toLocaleString()}
              </span>
              <span className="text-gray-600 text-base font-bold">/ person</span>
            </div>
            <p className="text-xs md:text-sm text-amber-900 bg-amber-100 font-semibold px-3 py-1 rounded-lg border border-amber-300 mt-2 inline-block">
              *Demo estimate based on 4-star twin sharing. Live booking requires confirmation.
            </p>
          </div>

          {/* Traveler Counter */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto">
            <div className="flex items-center gap-3.5 bg-white px-4 py-3 rounded-2xl border-2 border-gray-300 shadow-sm">
              <Users className="w-5 h-5 text-[#087E8B]" />
              <span className="text-sm font-black text-[#123047]">Travelers:</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-[#D9F3EF] hover:text-[#123047] font-black text-base flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-black text-lg text-gray-900">{travelers}</span>
                <button
                  type="button"
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-[#D9F3EF] hover:text-[#123047] font-black text-base flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total calculation */}
            <div className="text-right sm:border-l sm:pl-5 border-gray-300">
              <div className="text-xs md:text-sm text-gray-600 font-bold">Total Estimate ({travelers} Travelers)</div>
              <div className="text-3xl md:text-4xl font-black text-[#123047]">
                ৳{totalPriceBDT.toLocaleString()}
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={handleBook}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white font-black text-base shadow-lg shadow-[#087E8B]/30 hover:shadow-xl transition-all transform active:scale-95"
            >
              <span>Book This Package</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#D9F3EF]/40 rounded-2xl p-6 border-2 border-[#0FA392]/40">
            <h4 className="text-base font-black text-[#123047] flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#087E8B]" />
              <span>What's Included in This Package</span>
            </h4>
            <ul className="space-y-2.5 text-sm md:text-base text-gray-800 font-medium">
              {pkg.inclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 rounded-2xl p-6 border-2 border-rose-200">
            <h4 className="text-base font-black text-rose-950 flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Exclusions & Notes</span>
            </h4>
            <ul className="space-y-2.5 text-sm md:text-base text-gray-800 font-medium">
              {pkg.exclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5-Day Day-by-Day Interactive Itinerary */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-[#123047]">5-Day Signature Dubai Itinerary</h3>
              <p className="text-sm md:text-base text-gray-600 font-medium mt-1">Carefully curated schedule to maximize every moment of your Dubai vacation</p>
            </div>
            <span className="hidden sm:inline-block text-xs font-black px-4 py-2 rounded-full bg-[#123047] text-white">
              Detailed Breakdown
            </span>
          </div>

          {/* Day selection tabs */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {pkg.itinerary.map((d) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDay(d.day)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeDay === d.day
                    ? 'bg-[#123047] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>Day {d.day}</span>
              </button>
            ))}
          </div>

          {/* Timeline View */}
          <div className="relative border-l-4 border-[#087E8B]/40 ml-4 md:ml-6 pl-6 md:pl-10 space-y-8">
            {pkg.itinerary.map((item) => {
              const isSelected = activeDay === item.day;
              return (
                <div 
                  key={item.day} 
                  id={`day-${item.day}`}
                  className={`relative transition-all duration-300 ${isSelected ? 'scale-[1.01]' : 'opacity-95'}`}
                >
                  {/* Timeline Node Icon */}
                  <div className={`absolute -left-[38px] md:-left-[54px] top-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-sm md:text-base shadow-md transition-colors ${
                    isSelected ? 'bg-[#087E8B] text-white ring-4 ring-[#D9F3EF]' : 'bg-[#123047] text-white'
                  }`}>
                    {item.day}
                  </div>

                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    isSelected 
                      ? 'bg-white border-[#087E8B] shadow-xl' 
                      : 'bg-gray-50/80 border-gray-200'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs md:text-sm font-black uppercase tracking-wider text-[#087E8B]">
                        Day {item.day}
                      </span>
                      <span className="text-xs font-bold text-gray-500">Full Day Experience</span>
                    </div>

                    <h4 className="text-lg md:text-xl font-black text-[#123047] mb-3">
                      {item.title}
                    </h4>

                    <div className="space-y-2.5">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#087E8B] shrink-0 mt-2.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
