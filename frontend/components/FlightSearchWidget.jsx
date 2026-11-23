'use client';

import React, { useState } from 'react';
import { 
  Plane, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Search, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { flightApi } from '../lib/api';

const sampleInitialFlights = [
  {
    id: "fl-ek-583",
    flightNumber: "EK 583",
    airlineName: "Emirates",
    airlineLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80",
    departureAirport: "DAC",
    departureAirportName: "Hazrat Shahjalal Int'l, Dhaka",
    arrivalAirport: "DXB",
    arrivalAirportName: "Dubai International Airport (Terminal 3)",
    departureTime: "10:15 AM",
    arrivalTime: "02:05 PM",
    duration: "4h 50m",
    stops: "Non-stop",
    priceEconomy: 48500,
    priceBusiness: 125000,
    cabinClass: "Economy",
    aircraft: "Boeing 777-300ER",
    baggage: "30 kg Check-in"
  },
  {
    id: "fl-fz-584",
    flightNumber: "FZ 584",
    airlineName: "Flydubai",
    airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    departureAirport: "DAC",
    departureAirportName: "Hazrat Shahjalal Int'l, Dhaka",
    arrivalAirport: "DXB",
    arrivalAirportName: "Dubai International Airport (Terminal 2)",
    departureTime: "01:45 PM",
    arrivalTime: "05:40 PM",
    duration: "4h 55m",
    stops: "Non-stop",
    priceEconomy: 42000,
    priceBusiness: 89000,
    cabinClass: "Economy",
    aircraft: "Boeing 737 MAX 8",
    baggage: "20 kg Check-in"
  },
  {
    id: "fl-bg-347",
    flightNumber: "BG 347",
    airlineName: "Biman Bangladesh Airlines",
    airlineLogo: "https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80",
    departureAirport: "DAC",
    departureAirportName: "Hazrat Shahjalal Int'l, Dhaka",
    arrivalAirport: "DXB",
    arrivalAirportName: "Dubai International Airport (Terminal 1)",
    departureTime: "08:30 PM",
    arrivalTime: "12:30 AM",
    duration: "5h 00m",
    stops: "Non-stop",
    priceEconomy: 39500,
    priceBusiness: 82000,
    cabinClass: "Economy",
    aircraft: "Boeing 787 Dreamliner",
    baggage: "30 kg Check-in"
  },
  {
    id: "fl-gf-251",
    flightNumber: "GF 251 / 512",
    airlineName: "Gulf Air (Via Bahrain)",
    airlineLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80",
    departureAirport: "DAC",
    departureAirportName: "Hazrat Shahjalal Int'l, Dhaka",
    arrivalAirport: "DWC",
    arrivalAirportName: "Al Maktoum Int'l (Dubai World Central)",
    departureTime: "05:20 AM",
    arrivalTime: "11:30 AM",
    duration: "7h 10m",
    stops: "1 Stop (BAH)",
    priceEconomy: 36000,
    priceBusiness: 74000,
    cabinClass: "Economy",
    aircraft: "Airbus A321neo",
    baggage: "30 kg Check-in"
  }
];

const FlightSearchWidget = ({ onSelectFlight, initialArrival = "DXB" }) => {
  const [departureCity] = useState("Dhaka (DAC)");
  const [arrivalAirport, setArrivalAirport] = useState(initialArrival);
  const [departureDate, setDepartureDate] = useState("2026-12-15");
  const [returnDate, setReturnDate] = useState("2026-12-22");
  const [travelers, setTravelers] = useState(2);
  const [cabinClass, setCabinClass] = useState("Economy");

  const [flights, setFlights] = useState(sampleInitialFlights);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearched(true);

    try {
      const res = await flightApi.search({
        departureAirport: "DAC",
        arrivalAirport,
        departureDate,
        returnDate,
        travelers,
        cabinClass
      });
      if (res && res.data) {
        setFlights(res.data);
      }
    } catch {
      let list = sampleInitialFlights;
      if (arrivalAirport !== 'ALL') {
        list = list.filter(f => f.arrivalAirport === arrivalAirport);
      }
      setFlights(list);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full">
      {/* Search Input Box */}
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#D9F3EF] text-[#087E8B] flex items-center justify-center font-bold">
              <Plane className="w-5 h-5 -rotate-45" />
            </span>
            <div>
              <h3 className="font-heading font-black text-[#123047] text-xl md:text-2xl leading-tight">
                Dhaka ➔ Dubai Flight Search
              </h3>
              <p className="text-sm font-semibold text-gray-700">Compare flights to DXB and DWC airports</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-gray-300">
            <button
              type="button"
              onClick={() => setArrivalAirport('DXB')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                arrivalAirport === 'DXB' 
                  ? 'bg-[#087E8B] text-white shadow-md' 
                  : 'text-[#123047] hover:text-[#087E8B]'
              }`}
            >
              Option 1: DXB (Dubai Int'l)
            </button>
            <button
              type="button"
              onClick={() => setArrivalAirport('DWC')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                arrivalAirport === 'DWC' 
                  ? 'bg-[#087E8B] text-white shadow-md' 
                  : 'text-[#123047] hover:text-[#087E8B]'
              }`}
            >
              Option 2: DWC (Al Maktoum)
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Departure */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs md:text-sm font-black text-[#123047]">From (Departure City)</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 text-sm md:text-base font-bold">
              <Plane className="w-4 h-4 text-[#087E8B] flex-shrink-0" />
              <span>Hazrat Shahjalal (DAC)</span>
            </div>
          </div>

          {/* Arrival Airport */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs md:text-sm font-black text-[#123047]">To (Dubai Airport)</label>
            <select
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 text-sm md:text-base font-bold focus:border-[#087E8B] outline-none"
            >
              <option value="DXB">Dubai Int'l Airport (DXB)</option>
              <option value="DWC">Al Maktoum Int'l (DWC - World Central)</option>
              <option value="ALL">Compare Both (DXB & DWC)</option>
            </select>
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs md:text-sm font-black text-[#123047]">Departure & Return</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs md:text-sm font-bold text-gray-900 focus:border-[#087E8B] outline-none"
              />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs md:text-sm font-bold text-gray-900 focus:border-[#087E8B] outline-none"
              />
            </div>
          </div>

          {/* Travelers & Class */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs md:text-sm font-black text-[#123047]">Travelers & Class</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-xs md:text-sm">
                <Users className="w-4 h-4 text-[#087E8B]" />
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full text-center font-black text-gray-900 outline-none"
                />
              </div>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs md:text-sm font-bold text-gray-900 focus:border-[#087E8B] outline-none bg-white"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full h-[50px] bg-[#087E8B] hover:bg-[#066772] text-white font-black text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#087E8B]/30 hover:-translate-y-0.5 transition"
            >
              <Search className="w-5 h-5" />
              <span>{isSearching ? 'Searching...' : 'Search Flights'}</span>
            </button>
          </div>
        </form>

        {/* Airport Choice Guidance Note */}
        <div className="mt-5 pt-4 border-t-2 border-gray-100 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-700 font-medium">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#087E8B] flex-shrink-0" />
            <span>
              <strong className="text-[#123047]">DXB</strong> is 10 mins from Downtown & Burj Khalifa. <strong className="text-[#123047]">DWC</strong> offers economical low-cost flights and closer access to Dubai South & Expo City.
            </span>
          </div>
          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-black text-xs border border-amber-300">
            Demo Pricing in BDT (৳)
          </span>
        </div>
      </div>

      {/* Flight Search Results Cards */}
      <div className="mt-10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-black text-[#123047] text-2xl md:text-3xl">
            Available Dhaka ➔ Dubai Flight Schedules ({flights.length})
          </h4>
          <span className="text-sm font-bold text-gray-600">
            Calculated for {travelers} {travelers === 1 ? 'traveler' : 'travelers'} ({cabinClass})
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {flights.map((flight) => {
            const unitPrice = cabinClass === 'Business' ? flight.priceBusiness : flight.priceEconomy;
            const totalPrice = unitPrice * travelers;

            return (
              <div 
                key={flight.id} 
                className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#087E8B] p-6 shadow-md hover:shadow-xl transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Airline Info */}
                <div className="flex items-center gap-4 min-w-[220px]">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center p-2.5 flex-shrink-0">
                    <img 
                      src={flight.airlineLogo} 
                      alt={flight.airlineName} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-heading font-black text-[#123047] text-lg leading-tight">
                      {flight.airlineName}
                    </h5>
                    <span className="text-xs text-gray-600 font-mono font-bold">{flight.flightNumber}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {flight.stops}
                      </span>
                      <span className="text-xs font-bold text-gray-600">{flight.baggage}</span>
                    </div>
                  </div>
                </div>

                {/* Times & Route */}
                <div className="flex items-center gap-6 flex-1 justify-center">
                  <div className="text-center">
                    <span className="font-heading font-black text-2xl text-[#123047] block">{flight.departureTime}</span>
                    <span className="text-sm font-extrabold text-[#087E8B]">{flight.departureAirport} (Dhaka)</span>
                  </div>

                  <div className="flex flex-col items-center min-w-[130px]">
                    <span className="text-xs text-gray-600 font-bold mb-1">{flight.duration}</span>
                    <div className="w-full flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#087E8B]"></div>
                      <div className="flex-1 h-[2.5px] bg-gradient-to-r from-[#087E8B] to-gray-400"></div>
                      <Plane className="w-4 h-4 text-[#087E8B]" />
                      <div className="flex-1 h-[2.5px] bg-gradient-to-r from-gray-400 to-[#123047]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#123047]"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold mt-1">{flight.aircraft}</span>
                  </div>

                  <div className="text-center">
                    <span className="font-heading font-black text-2xl text-[#123047] block">{flight.arrivalTime}</span>
                    <span className="text-sm font-extrabold text-[#123047]">
                      {flight.arrivalAirport} ({flight.arrivalAirport === 'DXB' ? 'Dubai Int\'l' : 'Al Maktoum'})
                    </span>
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <div className="flex flex-col text-left lg:text-right">
                    <span className="text-xs uppercase font-extrabold text-gray-500">Demo Est. Fare</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold text-[#087E8B]">৳</span>
                      <span className="font-heading font-black text-3xl text-[#123047]">
                        {totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      ৳{unitPrice.toLocaleString()} / person ({travelers} {travelers === 1 ? 'pax' : 'pax'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectFlight && onSelectFlight({
                      flightId: flight.id,
                      flightNumber: flight.flightNumber,
                      airlineName: flight.airlineName,
                      departureAirport: flight.departureAirport,
                      arrivalAirport: flight.arrivalAirport,
                      cabinClass,
                      travelers,
                      unitPrice,
                      totalEstimatedCost: totalPrice,
                      departureDate,
                      returnDate
                    })}
                    className="bg-[#087E8B] hover:bg-[#066772] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md shadow-[#087E8B]/25 hover:-translate-y-0.5 transition"
                  >
                    Select & Request Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightSearchWidget;
