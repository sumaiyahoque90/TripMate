'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plane, Compass, Hotel, Gift, ArrowRight, ShieldCheck, Sparkles, 
  Star, Clock, Users, CheckCircle, Calculator, ChevronRight, HelpCircle, 
  MapPin, HeartHandshake, Award, Search, Globe
} from 'lucide-react';

import FlightSearchWidget from '../components/FlightSearchWidget';
import DestinationCard, { DUBAI_DESTINATIONS } from '../components/DestinationCard';
import HotelCard, { DUBAI_HOTELS } from '../components/HotelCard';
import RewardProgressCard from '../components/RewardProgressCard';
import PackageTimeline, { DUBAI_EXPLORER_PACKAGE } from '../components/PackageTimeline';
import BookingModal from '../components/BookingModal';
import api from '../lib/api';

export default function HomePage() {
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    bookingType: 'PACKAGE',
    itemName: 'Dhaka to Dubai – Dubai Explorer',
    priceBDT: 85000,
    travelers: 2,
    route: 'Dhaka (DAC) ➔ Dubai (DXB)',
    isPartnerHotel: false
  });

  const [hotelCategory, setHotelCategory] = useState('ALL');
  const [quickPlanner, setQuickPlanner] = useState({
    days: 5,
    travelers: 2,
    hotelTier: 'STANDARD',
    budgetBDT: 190000
  });

  // Calculate quick planner estimates
  const flightEstimate = 48000 * quickPlanner.travelers;
  const hotelRatePerNight = quickPlanner.hotelTier === 'BUDGET' ? 3500 : quickPlanner.hotelTier === 'LUXURY' ? 16000 : 6500;
  const hotelEstimate = hotelRatePerNight * (quickPlanner.days - 1) * Math.ceil(quickPlanner.travelers / 2);
  const foodEstimate = 2200 * quickPlanner.days * quickPlanner.travelers;
  const activitiesEstimate = 8500 * quickPlanner.travelers;
  const totalEstimate = flightEstimate + hotelEstimate + foodEstimate + activitiesEstimate;
  const isWithinBudget = totalEstimate <= quickPlanner.budgetBDT;

  const handleOpenBooking = (type, itemName, priceBDT, travelers = 2, route = 'Dhaka (DAC) ➔ Dubai (DXB)', isPartner = false) => {
    setBookingModalState({
      isOpen: true,
      bookingType: type,
      itemName,
      priceBDT,
      travelers,
      route,
      isPartnerHotel: isPartner
    });
  };

  const filteredHotels = hotelCategory === 'ALL'
    ? DUBAI_HOTELS
    : DUBAI_HOTELS.filter(h => h.category === hotelCategory);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION - Crisp High-Contrast Dark Blue Typography & Clear Backdrop */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-[#F0F7FA] via-[#E8F4F8] to-[#FFFFFF] overflow-hidden pt-12 pb-24 border-b border-gray-200">
        
        {/* Subtle Architectural Silhouette Background with Crisp Light Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85"
            alt="Dubai Skyline"
            fill
            priority
            className="object-cover object-center opacity-15 mix-blend-multiply scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-5xl mt-2">
          
          {/* Prominence Badge - High Contrast */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#123047]/10 border-2 border-[#123047]/20 text-[#123047] text-sm md:text-base font-extrabold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#087E8B]" />
            <span className="tracking-wide">Dhaka to Dubai International Travel Hub</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="hidden sm:inline text-[#087E8B]">Compare DXB vs DWC Airports</span>
          </div>

          {/* Main Headline - Bold Dark Blue (#123047) with Ocean Blue Accent */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#123047] tracking-tight leading-[1.15] mb-6">
            Your Journey, Your Budget, <br />
            <span className="text-[#087E8B] drop-shadow-sm">
              Your Adventure.
            </span>
          </h1>

          {/* Secondary Tagline - High Contrast Dark Slate Blue, Larger & Highly Visible */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#1E293B] font-semibold max-w-3xl mx-auto mb-10 leading-relaxed">
            Fly from Dhaka to Dubai. Plan your stay with smart budget insights, explore world-class attractions, and earn an exclusive 20% discount at our partner hotel.
          </p>

          {/* Quick CTA Actions - Bold, High-Contrast Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <a
              href="#flight-search"
              className="px-8 py-4 rounded-2xl bg-[#087E8B] hover:bg-[#066772] text-white font-extrabold text-base md:text-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-[#087E8B]/30 flex items-center gap-2.5"
            >
              <Plane className="w-5 h-5 text-[#D9F3EF]" />
              <span>Search Flights (DAC ➔ DXB/DWC)</span>
            </a>

            <a
              href="#explorer-package"
              className="px-8 py-4 rounded-2xl bg-[#123047] hover:bg-[#0B1E2D] text-white font-extrabold text-base md:text-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-[#123047]/25 flex items-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Dubai Explorer (5D/4N)</span>
            </a>

            <Link
              href="/planner"
              className="px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-[#123047] font-extrabold text-base md:text-lg border-2 border-[#123047] transition-all shadow-md flex items-center gap-2.5"
            >
              <Calculator className="w-5 h-5 text-[#087E8B]" />
              <span>Smart Trip Planner</span>
            </Link>
          </div>

          {/* Value Props Row - Solid White Cards with Bold Dark Blue Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left pt-6">
            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200/80 shadow-md flex items-center gap-3.5 hover:border-[#087E8B] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D9F3EF] flex items-center justify-center text-[#087E8B] shrink-0 font-bold">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-[#123047]">Dual Dubai Airports</p>
                <p className="text-xs font-semibold text-gray-600">DXB & DWC comparison</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200/80 shadow-md flex items-center gap-3.5 hover:border-[#087E8B] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D9F3EF] flex items-center justify-center text-[#087E8B] shrink-0 font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-[#123047]">BDT Budget Planner</p>
                <p className="text-xs font-semibold text-gray-600">Personalized cost breakdown</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200/80 shadow-md flex items-center gap-3.5 hover:border-[#087E8B] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D9F3EF] flex items-center justify-center text-[#087E8B] shrink-0 font-bold">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-[#123047]">Handpicked Hotels</p>
                <p className="text-xs font-semibold text-gray-600">Budget to 5-star luxury</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-gray-200/80 shadow-md flex items-center gap-3.5 hover:border-accent-coral transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 font-bold">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-[#123047]">20% Review Reward</p>
                <p className="text-xs font-semibold text-gray-600">Partner hotel discount</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FLIGHT SEARCH & AIRPORT COMPARISON WIDGET */}
      <section id="flight-search" className="container mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        <FlightSearchWidget 
          onSelectFlight={(flight) => {
            handleOpenBooking(
              'FLIGHT',
              `${flight.airline} Flight ${flight.flightNumber} (${flight.origin} ➔ ${flight.destination})`,
              flight.economyPriceBDT,
              flight.travelers || 1,
              `${flight.origin} ➔ ${flight.destination}`
            );
          }}
        />
      </section>

      {/* 3. SIGNATURE INTERNATIONAL PACKAGE (Dhaka to Dubai – Dubai Explorer) */}
      <section id="explorer-package" className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9F3EF] border border-[#0FA392]/30 text-[#123047] text-xs md:text-sm font-extrabold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-[#087E8B]" />
            <span>Featured International Package</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#123047] tracking-tight">
            Dhaka to Dubai – Dubai Explorer (5D / 4N)
          </h2>
          <p className="text-gray-700 text-base md:text-lg font-medium mt-3 leading-relaxed">
            Complete, hassle-free international travel package with return flights from Dhaka, Burj Khalifa tickets, thrilling desert safari, marina cruise, and 4-star hotel stay.
          </p>
        </div>

        <PackageTimeline 
          onBookPackage={(data) => {
            handleOpenBooking(
              'PACKAGE',
              data.packageTitle,
              DUBAI_EXPLORER_PACKAGE.basePriceBDT,
              data.travelers,
              'Dhaka (DAC) ➔ Dubai (DXB/DWC)'
            );
          }}
        />
      </section>

      {/* 4. FEATURED DUBAI TOURIST ATTRACTIONS */}
      <section id="destinations" className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#087E8B]/10 text-[#087E8B] text-xs md:text-sm font-extrabold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>Explore Dubai</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#123047] tracking-tight">
              Iconic Tourist Attractions
            </h2>
            <p className="text-gray-700 text-base md:text-lg font-medium mt-1">
              From sky-high observation decks to golden Arabian sand dunes, discover Dubai's top sights.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-[#087E8B] font-extrabold text-base hover:text-[#123047] transition-colors self-start md:self-auto"
          >
            <span>View All Dubai Sights</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUBAI_DESTINATIONS.slice(0, 8).map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onPlanTrip={(d) => {
                handleOpenBooking(
                  'CUSTOM_PLAN',
                  `Trip to ${d.name}, Dubai`,
                  d.priceBDT,
                  2,
                  'Dhaka (DAC) ➔ Dubai'
                );
              }}
            />
          ))}
        </div>
      </section>

      {/* 5. RECOMMENDED DUBAI HOTELS & PARTNER 20% DISCOUNT */}
      <section id="hotels" className="container mx-auto px-4 sm:px-6 bg-slate-50/80 py-16 rounded-3xl border-2 border-gray-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9F3EF] text-[#123047] text-xs md:text-sm font-extrabold uppercase tracking-wider mb-2">
              <Hotel className="w-4 h-4 text-[#087E8B]" />
              <span>Accommodation Guide</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#123047] tracking-tight">
              Featured Dubai Hotels
            </h2>
            <p className="text-gray-700 text-base md:text-lg font-medium mt-1">
              Select verified hotels across prime Dubai districts. Enjoy 20% OFF at our Partner Hotel!
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PARTNER', 'BUDGET', 'STANDARD', 'PREMIUM', 'LUXURY'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setHotelCategory(cat === 'PARTNER' ? 'STANDARD' : cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all ${
                  (cat === 'PARTNER' && hotelCategory === 'STANDARD') || hotelCategory === cat
                    ? 'bg-[#123047] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {cat === 'PARTNER' ? '★ Partner Hotel' : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.slice(0, 6).map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onBookHotel={(h, room) => {
                handleOpenBooking(
                  'HOTEL',
                  `${h.name} - ${room ? room.type : 'Standard Room'}`,
                  room ? room.priceBDT : h.priceBDT,
                  2,
                  h.location,
                  h.isPartner
                );
              }}
            />
          ))}
        </div>
      </section>

      {/* 6. SMART PERSONALIZED TRIP PLANNER TEASER */}
      <section id="planner" className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#123047] rounded-3xl text-white p-6 md:p-12 shadow-2xl relative overflow-hidden border-2 border-[#087E8B]/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#087E8B]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left pitch */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9F3EF]/20 text-[#D9F3EF] text-xs md:text-sm font-extrabold uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>Smart Budget Planner</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Plan Your Dubai Trip According to Your Budget
              </h2>

              <p className="text-white/90 text-base md:text-lg leading-relaxed font-normal">
                Take the guesswork out of vacation finances. Adjust duration, travelers, and hotel comfort to see an instant BDT cost breakdown across flights, lodging, meals, and iconic attractions.
              </p>

              <div className="pt-2">
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#D9F3EF] text-[#123047] font-black text-base hover:bg-white transition-all shadow-lg hover:shadow-[#D9F3EF]/25"
                >
                  <span>Open Full Smart Planner</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Quick Calculator Widget */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-white">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#D9F3EF]">Interactive Quick Estimator</span>
                <span className="text-xs md:text-sm text-white/80 font-bold">Estimates in BDT (৳)</span>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs md:text-sm font-bold text-white block mb-1.5">Duration</label>
                  <select
                    value={quickPlanner.days}
                    onChange={(e) => setQuickPlanner({ ...quickPlanner, days: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#0B1E2D] border-2 border-white/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-[#D9F3EF]"
                  >
                    <option value={3}>3 Days / 2 Nights</option>
                    <option value={4}>4 Days / 3 Nights</option>
                    <option value={5}>5 Days / 4 Nights</option>
                    <option value={7}>7 Days / 6 Nights</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-bold text-white block mb-1.5">Travelers</label>
                  <select
                    value={quickPlanner.travelers}
                    onChange={(e) => setQuickPlanner({ ...quickPlanner, travelers: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#0B1E2D] border-2 border-white/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-[#D9F3EF]"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Solo Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-bold text-white block mb-1.5">Hotel Category</label>
                  <select
                    value={quickPlanner.hotelTier}
                    onChange={(e) => setQuickPlanner({ ...quickPlanner, hotelTier: e.target.value })}
                    className="w-full bg-[#0B1E2D] border-2 border-white/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-[#D9F3EF]"
                  >
                    <option value="BUDGET">Budget (৳3,500/nt)</option>
                    <option value="STANDARD">Standard (৳6,500/nt)</option>
                    <option value="LUXURY">Luxury 5-Star (৳16,000/nt)</option>
                  </select>
                </div>
              </div>

              {/* Expense Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs md:text-sm">
                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                  <span className="text-white/70 block mb-1 font-semibold">Flights (Return)</span>
                  <span className="font-extrabold text-base text-white">৳{flightEstimate.toLocaleString()}</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                  <span className="text-white/70 block mb-1 font-semibold">Hotel Stay</span>
                  <span className="font-extrabold text-base text-white">৳{hotelEstimate.toLocaleString()}</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                  <span className="text-white/70 block mb-1 font-semibold">Dining & Food</span>
                  <span className="font-extrabold text-base text-white">৳{foodEstimate.toLocaleString()}</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
                  <span className="text-white/70 block mb-1 font-semibold">Activities</span>
                  <span className="font-extrabold text-base text-white">৳{activitiesEstimate.toLocaleString()}</span>
                </div>
              </div>

              {/* Total & Status Bar */}
              <div className="bg-white/15 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20">
                <div>
                  <div className="text-xs md:text-sm text-white/80 font-bold">Estimated Total for {quickPlanner.travelers} Persons:</div>
                  <div className="text-3xl font-black text-[#D9F3EF]">৳{totalEstimate.toLocaleString()}</div>
                  <div className="text-xs text-white/70 font-medium">৳{Math.round(totalEstimate / quickPlanner.travelers).toLocaleString()} / person</div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`px-4 py-2 rounded-full text-xs md:text-sm font-black ${
                    isWithinBudget ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50' : 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                  }`}>
                    {isWithinBudget ? '✓ Realistic Demo Plan' : 'Budget Advisory'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      handleOpenBooking(
                        'CUSTOM_PLAN',
                        `Smart Custom Plan: ${quickPlanner.days} Days / ${quickPlanner.hotelTier} Stay`,
                        totalEstimate,
                        quickPlanner.travelers,
                        'Dhaka (DAC) ➔ Dubai'
                      );
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white font-extrabold text-xs md:text-sm transition-colors shadow-md"
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRIPMATE LOYALTY REWARDS (Review 3 Times, Get 20% OFF!) */}
      <section id="rewards" className="container mx-auto px-4 sm:px-6">
        <RewardProgressCard 
          onBookPartnerHotel={() => {
            handleOpenBooking(
              'HOTEL',
              'TripMate Dubai Partner Hotel (Demo)',
              7500,
              2,
              'Al Barsha, Dubai (Near Mall of the Emirates)',
              true
            );
          }}
        />
      </section>

      {/* 8. HOW TRIPMATE WORKS */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9F3EF] text-[#123047] text-xs md:text-sm font-extrabold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-4 h-4 text-[#087E8B]" />
            <span>Seamless Process</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#123047] tracking-tight">
            How TripMate Works
          </h2>
          <p className="text-gray-700 text-base md:text-lg font-medium mt-2">
            Four simple steps to turn your Dubai vacation dream into an unforgettable reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Compare DAC ➔ DXB & DWC',
              desc: 'Select preferred flight schedules, airlines, and airport options with full fare transparency.',
              icon: Plane
            },
            {
              step: '02',
              title: 'Curate Stays & Sights',
              desc: 'Choose from handpicked hotels across Dubai and add world-famous experiences to your list.',
              icon: Hotel
            },
            {
              step: '03',
              title: 'Budget with Confidence',
              desc: 'Use our Smart Trip Planner to evaluate total BDT cost and avoid hidden travel surprises.',
              icon: Calculator
            },
            {
              step: '04',
              title: 'Earn 20% OFF Rewards',
              desc: 'Submit 3 verified reviews to automatically unlock a 20% discount on your next partner stay.',
              icon: Gift
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D9F3EF] flex items-center justify-center text-[#087E8B]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-gray-300">{item.step}</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-[#123047] mb-2">{item.title}</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CUSTOMER TESTIMONIALS */}
      <section className="container mx-auto px-4 sm:px-6 bg-gradient-to-br from-[#D9F3EF]/30 to-transparent py-16 rounded-3xl border-2 border-[#D9F3EF]/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm text-[#087E8B] text-xs md:text-sm font-extrabold uppercase tracking-wider mb-2 border">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Verified Travelers</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#123047] tracking-tight">
            Loved by Bangladeshi Travelers
          </h2>
          <p className="text-gray-700 text-base md:text-lg font-medium mt-1">
            Real stories from travelers who planned their Dubai trips with TripMate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Tanvir Ahmed',
              location: 'Gulshan, Dhaka',
              trip: 'Dubai Explorer (5D/4N)',
              rating: 5,
              text: 'The Dubai Explorer package was flawless! From the smooth flight out of Dhaka to the VIP Burj Khalifa fast-track and desert safari dune bashing, every penny was well-spent. We just unlocked our 20% loyalty voucher too!'
            },
            {
              name: 'Nusrat Jahan',
              location: 'Dhanmondi, Dhaka',
              trip: 'Family Vacation in Al Barsha',
              rating: 5,
              text: 'Comparing DXB vs DWC airport options saved our family over ৳28,000 on flights. The Smart Planner gave us an accurate budget down to dining and water taxis. Highly recommended for first-time Dubai visitors!'
            },
            {
              name: 'Dr. Rafiqul Islam',
              location: 'Uttara, Dhaka',
              trip: 'TripMate Partner Hotel Stay',
              rating: 5,
              text: 'TripMate Dubai Partner Hotel exceeded all expectations. Extremely clean, 5 minutes from Mall of the Emirates, and the 20% discount code worked instantly at checkout. Truly professional service.'
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-800 italic leading-relaxed mb-6 font-medium">
                  "{t.text}"
                </p>
              </div>
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm md:text-base font-extrabold text-[#123047]">{t.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{t.location}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#D9F3EF] text-[#123047] font-extrabold">
                  {t.trip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. WHY CHOOSE TRIPMATE */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="bg-[#123047] rounded-3xl p-8 md:p-14 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#D9F3EF] text-xs md:text-sm font-extrabold uppercase tracking-wider">The TripMate Edge</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-2 mb-5 leading-tight">
                Designed Exclusively for Bangladeshi Travelers Flying to Dubai
              </h2>
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 font-normal">
                Unlike generic global OTAs, TripMate focuses on the exact Dhaka-to-Dubai corridor. We provide transparent pricing in Bangladeshi Taka (BDT), dual airport analysis, authentic Halal dining guidance, and real customer rewards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm md:text-base">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#D9F3EF] shrink-0 mt-0.5" />
                  <span><strong>Zero Hidden Surcharges:</strong> All taxes and airport fees included in demo estimates.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#D9F3EF] shrink-0 mt-0.5" />
                  <span><strong>Dual Airport Guidance:</strong> Choose DXB for central luxury or DWC for budget savings.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#D9F3EF] shrink-0 mt-0.5" />
                  <span><strong>Bangladeshi Support:</strong> Assistance in Bengali and English around the clock.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#D9F3EF] shrink-0 mt-0.5" />
                  <span><strong>Verified Loyalty Program:</strong> 20% off partner hotel after 3 honest reviews.</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <Sparkles className="w-12 h-12 text-[#D9F3EF] mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Ready to Experience Dubai?</h3>
              <p className="text-sm md:text-base text-white/90 mb-8 max-w-md mx-auto">
                Explore flights, customize your itinerary, or reserve our signature 5D/4N Dubai Explorer package today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3.5">
                <button
                  type="button"
                  onClick={() => handleOpenBooking('PACKAGE', 'Dhaka to Dubai – Dubai Explorer', 85000, 2)}
                  className="px-7 py-3.5 rounded-xl bg-[#087E8B] hover:bg-[#066772] text-white font-extrabold text-sm md:text-base transition-all shadow-md"
                >
                  Book Dubai Explorer (৳85,000)
                </button>
                <Link
                  href="/planner"
                  className="px-7 py-3.5 rounded-xl bg-white/20 text-white font-bold text-sm md:text-base hover:bg-white/30 transition-all border border-white/30"
                >
                  Customize My Budget
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={() => setBookingModalState({ ...bookingModalState, isOpen: false })}
        initialBookingType={bookingModalState.bookingType}
        initialItemName={bookingModalState.itemName}
        initialPriceBDT={bookingModalState.priceBDT}
        initialTravelers={bookingModalState.travelers}
        initialRoute={bookingModalState.route}
        isPartnerHotel={bookingModalState.isPartnerHotel}
      />
    </div>
  );
}
