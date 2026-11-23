'use client';

import React, { useState } from 'react';
import BookingModal from '../../components/BookingModal';
import { 
  Calculator, Sparkles, CheckCircle, AlertTriangle, ArrowRight, 
  Plane, Hotel, Utensils, Compass, DollarSign, Users, Calendar, ShieldCheck 
} from 'lucide-react';
import api from '../../lib/api';

export default function SmartPlannerPage() {
  // Planner State
  const [plannerData, setPlannerData] = useState({
    destination: 'Dubai, UAE',
    days: 5,
    travelers: 2,
    totalBudgetBDT: 200000,
    airportChoice: 'DXB', // DXB (৳48,000) or DWC (৳42,000)
    flightClass: 'ECONOMY', // ECONOMY (1.0x) or BUSINESS (2.5x)
    hotelTier: 'STANDARD', // BUDGET (3500), STANDARD (6500), PREMIUM (10500), LUXURY (18000)
    foodTier: 'MODERATE', // BUDGET (1500), MODERATE (2500), FINE_DINING (4500) per person/day
    selectedActivities: [
      'burj-khalifa',
      'desert-safari',
      'marina-cruise'
    ]
  });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  // Activity Catalog with prices in BDT
  const ACTIVITIES_CATALOG = [
    { id: 'burj-khalifa', name: 'Burj Khalifa "At The Top" (124th/125th floor)', priceBDT: 5500 },
    { id: 'desert-safari', name: 'Red Dunes Desert Safari & BBQ Dinner', priceBDT: 5800 },
    { id: 'marina-cruise', name: 'Dubai Marina Dhow Cruise Dinner', priceBDT: 4200 },
    { id: 'miracle-garden', name: 'Dubai Miracle Garden Admission', priceBDT: 3200 },
    { id: 'museum-future', name: 'Museum of the Future Interactive Tour', priceBDT: 5200 },
    { id: 'aquaventure', name: 'Atlantis Aquaventure Waterpark', priceBDT: 8900 },
    { id: 'dubai-frame', name: 'Dubai Frame Observation Glass Bridge', priceBDT: 1900 },
    { id: 'abu-dhabi-day', name: 'Abu Dhabi City Tour & Sheikh Zayed Mosque', priceBDT: 7500 }
  ];

  // Dynamic calculations
  const flightBase = plannerData.airportChoice === 'DWC' ? 42000 : 48000;
  const flightMultiplier = plannerData.flightClass === 'BUSINESS' ? 2.5 : 1.0;
  const totalFlightsCost = Math.round(flightBase * flightMultiplier * plannerData.travelers);

  const hotelRatePerNight = {
    BUDGET: 3500,
    STANDARD: 6500,
    PREMIUM: 10500,
    LUXURY: 18000
  }[plannerData.hotelTier] || 6500;

  const roomsNeeded = Math.ceil(plannerData.travelers / 2);
  const nights = Math.max(1, plannerData.days - 1);
  const totalHotelCost = hotelRatePerNight * nights * roomsNeeded;

  const foodDailyRate = {
    BUDGET: 1500,
    MODERATE: 2500,
    FINE_DINING: 4500
  }[plannerData.foodTier] || 2500;

  const totalFoodCost = foodDailyRate * plannerData.days * plannerData.travelers;

  const activitiesCostPerPerson = plannerData.selectedActivities.reduce((sum, actId) => {
    const act = ACTIVITIES_CATALOG.find(a => a.id === actId);
    return sum + (act ? act.priceBDT : 0);
  }, 0);

  const totalActivitiesCost = activitiesCostPerPerson * plannerData.travelers;
  const localTransportCost = 1200 * plannerData.days * plannerData.travelers; // Metro / Careem taxi estimate

  const estimatedTotalCost = totalFlightsCost + totalHotelCost + totalFoodCost + totalActivitiesCost + localTransportCost;
  const costPerPerson = Math.round(estimatedTotalCost / plannerData.travelers);
  const budgetDifference = plannerData.totalBudgetBDT - estimatedTotalCost;
  const isWithinBudget = budgetDifference >= 0;

  // Toggle activity checkbox
  const toggleActivity = (id) => {
    setPlannerData(prev => {
      const exists = prev.selectedActivities.includes(id);
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter(a => a !== id)
          : [...prev.selectedActivities, id]
      };
    });
  };

  const handleSavePlan = async () => {
    setSavingPlan(true);
    try {
      await api.submitTripPlan({
        destination: plannerData.destination,
        travelDuration: plannerData.days,
        numberOfTravelers: plannerData.travelers,
        totalBudgetBDT: plannerData.totalBudgetBDT,
        estimatedTotalCostBDT: estimatedTotalCost,
        breakdownTransportation: totalFlightsCost + localTransportCost,
        breakdownAccommodation: totalHotelCost,
        breakdownFood: totalFoodCost,
        breakdownActivities: totalActivitiesCost,
        status: isWithinBudget ? 'WITHIN_BUDGET' : 'OVER_BUDGET'
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (e) {
      // Still allow booking popup
    } finally {
      setSavingPlan(false);
      setBookingModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10 max-w-7xl">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-navy text-xs font-bold uppercase tracking-wider mb-3">
          <Calculator className="w-4 h-4 text-ocean" />
          <span>Interactive Travel Budget Calculator</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-navy tracking-tight">
          Smart Dubai Trip Planner
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Customize your flights, hotel tier, dining style, and top attractions to get a realistic, itemized expense forecast in Bangladeshi Taka (BDT).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Controls Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 space-y-8">
          
          {/* Section 1: Trip Basics */}
          <div>
            <h3 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-ocean" />
              <span>1. Trip Parameters & Budget</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Destination</label>
                <select
                  value={plannerData.destination}
                  onChange={(e) => setPlannerData({ ...plannerData, destination: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-ocean"
                >
                  <option value="Dubai, UAE">Dubai, UAE</option>
                  <option value="Dubai & Abu Dhabi">Dubai & Abu Dhabi</option>
                  <option value="Dubai & Sharjah">Dubai & Sharjah</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Duration (Days)</label>
                <select
                  value={plannerData.days}
                  onChange={(e) => setPlannerData({ ...plannerData, days: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-ocean"
                >
                  {[3, 4, 5, 6, 7, 8, 10, 14].map(d => (
                    <option key={d} value={d}>{d} Days / {d - 1} Nights</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Travelers</label>
                <select
                  value={plannerData.travelers}
                  onChange={(e) => setPlannerData({ ...plannerData, travelers: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-ocean"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Solo Traveler' : 'Travelers'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700">Your Target Total Budget (BDT)</label>
                <span className="text-base font-black text-navy font-mono">
                  ৳{plannerData.totalBudgetBDT.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={80000}
                max={600000}
                step={5000}
                value={plannerData.totalBudgetBDT}
                onChange={(e) => setPlannerData({ ...plannerData, totalBudgetBDT: parseInt(e.target.value, 10) })}
                className="w-full accent-ocean cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>৳80,000 (Backpacker)</span>
                <span>৳300,000 (Standard Family)</span>
                <span>৳600,000 (VIP Luxury)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Flights & Airport */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
              <Plane className="w-5 h-5 text-ocean" />
              <span>2. Flight Preference from Dhaka</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Arrival Dubai Airport</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannerData({ ...plannerData, airportChoice: 'DXB' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      plannerData.airportChoice === 'DXB'
                        ? 'border-ocean bg-ocean/5 text-navy ring-1 ring-ocean'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs">DXB (Central)</div>
                    <div className="text-[10px] text-gray-500">~৳48,000 / seat</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlannerData({ ...plannerData, airportChoice: 'DWC' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      plannerData.airportChoice === 'DWC'
                        ? 'border-ocean bg-ocean/5 text-navy ring-1 ring-ocean'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs">DWC (Budget)</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Save ~৳6,000</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Cabin Class</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannerData({ ...plannerData, flightClass: 'ECONOMY' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      plannerData.flightClass === 'ECONOMY'
                        ? 'border-ocean bg-ocean/5 text-navy ring-1 ring-ocean'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs">Economy Class</div>
                    <div className="text-[10px] text-gray-500">Standard 30kg</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlannerData({ ...plannerData, flightClass: 'BUSINESS' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      plannerData.flightClass === 'BUSINESS'
                        ? 'border-ocean bg-ocean/5 text-navy ring-1 ring-ocean'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-extrabold text-xs">Business Class</div>
                    <div className="text-[10px] text-amber-600 font-semibold">VIP Lounge</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Hotel & Dining */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
              <Hotel className="w-5 h-5 text-ocean" />
              <span>3. Hotel Comfort & Daily Dining</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Hotel Category</label>
                <select
                  value={plannerData.hotelTier}
                  onChange={(e) => setPlannerData({ ...plannerData, hotelTier: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-ocean"
                >
                  <option value="BUDGET">Budget Friendly (৳3,500/night)</option>
                  <option value="STANDARD">Standard 3-4★ (৳6,500/night)</option>
                  <option value="PREMIUM">Premium 4★ Superior (৳10,500/night)</option>
                  <option value="LUXURY">5-Star Luxury (৳18,000/night)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  Calculation assumes {roomsNeeded} double room{roomsNeeded > 1 ? 's' : ''} for {nights} nights.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Daily Food & Halal Dining</label>
                <select
                  value={plannerData.foodTier}
                  onChange={(e) => setPlannerData({ ...plannerData, foodTier: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-ocean"
                >
                  <option value="BUDGET">Budget / Cafeterias (৳1,500/day/pax)</option>
                  <option value="MODERATE">Casual Dining & Malls (৳2,500/day/pax)</option>
                  <option value="FINE_DINING">Premium & Waterfront (৳4,500/day/pax)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  Authentic Bangladeshi & Middle Eastern Halal options widely available.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Attractions & Activities Checklist */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-navy flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-ocean" />
                <span>4. Select Attractions & Activities</span>
              </span>
              <span className="text-xs text-gray-400">
                {plannerData.selectedActivities.length} selected
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACTIVITIES_CATALOG.map((act) => {
                const checked = plannerData.selectedActivities.includes(act.id);
                return (
                  <div
                    key={act.id}
                    onClick={() => toggleActivity(act.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      checked
                        ? 'border-ocean bg-ocean/5 text-navy font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}} // handled by parent div
                        className="accent-ocean rounded"
                      />
                      <span>{act.name}</span>
                    </div>
                    <span className="text-ocean font-mono text-xs shrink-0 ml-2">
                      +৳{act.priceBDT.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Real-time Budget Calculation Card */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          <div className="bg-navy text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-teal/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-ocean/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-teal font-extrabold">Estimated Expense Forecast</span>
              <span className="text-xs text-white/60">Demo Pricing in BDT</span>
            </div>

            {/* Total Highlight */}
            <div className="mb-6">
              <div className="text-xs text-white/70">Total Estimated Cost ({plannerData.travelers} Travelers):</div>
              <div className="text-4xl font-black text-teal mt-0.5">
                ৳{estimatedTotalCost.toLocaleString()}
              </div>
              <div className="text-xs text-white/60 mt-1 flex items-center gap-2">
                <span>≈ ৳{costPerPerson.toLocaleString()} per person</span>
                <span>•</span>
                <span>{plannerData.days} Days / {nights} Nights</span>
              </div>
            </div>

            {/* Budget Meter / Status */}
            <div className={`p-4 rounded-2xl mb-6 border transition-all ${
              isWithinBudget 
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200' 
                : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {isWithinBudget ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Within Your Target Budget!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>Exceeds Budget by ৳{Math.abs(budgetDifference).toLocaleString()}</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {isWithinBudget 
                  ? `You have an estimated cushion of ৳${budgetDifference.toLocaleString()} for shopping at Dubai Mall or Gold Souk!`
                  : `Tip: Switch to DWC airport or Standard hotel tier to bring this plan within your ৳${plannerData.totalBudgetBDT.toLocaleString()} target.`}
              </p>
            </div>

            {/* Itemized Cost Breakdown Table */}
            <div className="space-y-3 text-xs mb-6 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center text-white/80">
                <span className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-teal" />
                  <span>Flights ({plannerData.airportChoice}, {plannerData.flightClass.toLowerCase()})</span>
                </span>
                <span className="font-mono font-bold text-white">৳{totalFlightsCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-white/80">
                <span className="flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-teal" />
                  <span>Hotel Stay ({plannerData.hotelTier.toLowerCase()} • {nights} nights)</span>
                </span>
                <span className="font-mono font-bold text-white">৳{totalHotelCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-white/80">
                <span className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-teal" />
                  <span>Dining & Food ({plannerData.foodTier.toLowerCase()})</span>
                </span>
                <span className="font-mono font-bold text-white">৳{totalFoodCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-white/80">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal" />
                  <span>Attractions & Experiences ({plannerData.selectedActivities.length})</span>
                </span>
                <span className="font-mono font-bold text-white">৳{totalActivitiesCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-white/80">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-teal" />
                  <span>Local Metro & Taxi Transport</span>
                </span>
                <span className="font-mono font-bold text-white">৳{localTransportCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleSavePlan}
              disabled={savingPlan}
              className="w-full py-3.5 rounded-xl bg-teal hover:bg-teal-light text-navy font-black text-sm transition-all shadow-lg hover:shadow-teal/20 flex items-center justify-center gap-2"
            >
              <span>{savingPlan ? 'Calculating...' : 'Request Booking for this Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo Note */}
            <p className="text-[11px] text-white/50 text-center mt-3">
              * Calculations are demo estimates for vacation budget planning.
            </p>
          </div>

          {/* Partner Hotel Discount Tip */}
          <div className="bg-teal/15 rounded-2xl p-5 border border-teal/40">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-coral" />
              <span>TripMate Loyalty Tip</span>
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Did you know? After 3 completed verified reviews on TripMate, you receive a <strong>20% discount</strong> at our Dubai Partner Hotel, saving you an additional ~৳{Math.round(totalHotelCost * 0.2).toLocaleString()} on this plan!
            </p>
          </div>

        </div>
      </div>

      {/* Universal Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialBookingType="CUSTOM_PLAN"
        initialItemName={`Custom Plan: ${plannerData.days}D in ${plannerData.destination} (${plannerData.hotelTier} Stay)`}
        initialPriceBDT={costPerPerson}
        initialTravelers={plannerData.travelers}
        initialRoute={`Dhaka (DAC) ➔ Dubai (${plannerData.airportChoice})`}
      />
    </div>
  );
}
