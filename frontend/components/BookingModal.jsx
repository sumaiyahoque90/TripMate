'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ShieldCheck, Tag, Calendar, Users, 
  MapPin, Phone, Mail, User, AlertCircle, Sparkles, Copy, ArrowRight, Printer 
} from 'lucide-react';
import api from '../lib/api';

export default function BookingModal({
  isOpen,
  onClose,
  initialBookingType = 'PACKAGE', // 'PACKAGE' | 'FLIGHT' | 'HOTEL' | 'CUSTOM_PLAN'
  initialItemName = 'Dhaka to Dubai – Dubai Explorer',
  initialPriceBDT = 85000,
  initialTravelers = 2,
  initialRoute = 'Dhaka (DAC) ➔ Dubai (DXB)',
  isPartnerHotel = false
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    returnDate: '',
    travelers: initialTravelers || 2,
    destination: 'Dubai, UAE',
    route: initialRoute || 'Dhaka (DAC) ➔ Dubai (DXB)',
    bookingType: initialBookingType || 'PACKAGE',
    itemName: initialItemName || 'Dhaka to Dubai – Dubai Explorer',
    voucherCode: '',
    specialRequests: ''
  });

  const [basePriceBDT, setBasePriceBDT] = useState(initialPriceBDT || 85000);
  const [voucherApplied, setVoucherApplied] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [validatingVoucher, setValidatingVoucher] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      // Auto-prefill user if logged in
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('tripmate_user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setFormData(prev => ({
              ...prev,
              fullName: user.name || prev.fullName,
              email: user.email || prev.email,
              phone: user.phone || prev.phone
            }));
          } catch (e) {}
        }
      }

      setFormData(prev => ({
        ...prev,
        bookingType: initialBookingType,
        itemName: initialItemName,
        route: initialRoute,
        travelers: initialTravelers || 2
      }));
      setBasePriceBDT(initialPriceBDT);
      setConfirmedBooking(null);
      setError('');
      setVoucherApplied(null);
      setVoucherError('');
    }
  }, [isOpen, initialBookingType, initialItemName, initialPriceBDT, initialTravelers, initialRoute]);

  if (!isOpen) return null;

  // Calculate pricing
  const rawTotal = basePriceBDT * (formData.travelers || 1);
  const discountPercent = voucherApplied ? (voucherApplied.discountPercent || 20) : 0;
  const discountAmount = voucherApplied ? Math.round((rawTotal * discountPercent) / 100) : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  // Voucher validation
  const handleApplyVoucher = async () => {
    if (!formData.voucherCode.trim()) {
      setVoucherError('Please enter a voucher code');
      return;
    }
    setValidatingVoucher(true);
    setVoucherError('');
    try {
      const res = await api.validateVoucher(formData.voucherCode.trim());
      if (res.valid) {
        setVoucherApplied(res.voucher);
        setVoucherError('');
      } else {
        setVoucherError(res.message || 'Invalid or expired voucher code');
        setVoucherApplied(null);
      }
    } catch (err) {
      setVoucherError(err.message || 'Error validating voucher code');
      setVoucherApplied(null);
    } finally {
      setValidatingVoucher(false);
    }
  };

  // Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.travelDate) {
      setError('Please fill in all required fields (Name, Email, Phone, Travel Date).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookingType: formData.bookingType,
        destination: formData.destination,
        route: formData.route,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        travelDate: formData.travelDate,
        returnDate: formData.returnDate || null,
        travelers: parseInt(formData.travelers, 10) || 1,
        selectedItem: formData.itemName,
        totalAmountBDT: finalTotal,
        voucherCode: voucherApplied ? voucherApplied.code : null,
        discountAmountBDT: discountAmount,
        specialRequests: formData.specialRequests
      };

      const result = await api.createBooking(payload);
      setConfirmedBooking(result.data || {
        referenceNumber: 'TM-DXB-' + Math.floor(100000 + Math.random() * 900000),
        ...payload,
        status: 'CONFIRMED_DEMO'
      });
    } catch (err) {
      setError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-ocean text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-teal text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-accent-coral" />
            <span>TripMate Booking Request (Demo)</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-white">
            {confirmedBooking ? 'Reservation Confirmed!' : `Reserve: ${formData.itemName}`}
          </h3>
          <p className="text-white/80 text-xs md:text-sm mt-1">
            {confirmedBooking 
              ? 'Your international travel reservation has been registered in the TripMate demo system.'
              : 'Complete your booking request below. Receive your instant estimate and booking voucher.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
          {confirmedBooking ? (
            /* Confirmation Voucher View */
            <div className="space-y-6">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black text-emerald-950 mb-1">Booking Confirmed (Demo)</h4>
                <p className="text-xs text-emerald-800">
                  Your trip reference code has been generated. No credit card charge applied.
                </p>
                <div className="mt-4 inline-flex items-center gap-3 bg-white border border-emerald-300 px-4 py-2 rounded-xl">
                  <span className="text-xs font-bold text-gray-500 uppercase">Booking Reference:</span>
                  <span className="font-mono text-base font-extrabold text-ocean">
                    {confirmedBooking.referenceNumber}
                  </span>
                </div>
              </div>

              {/* Summary Details Table */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-xs md:text-sm space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-bold text-navy">{confirmedBooking.selectedItem || confirmedBooking.bookingType}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Route / Destination:</span>
                  <span className="font-semibold text-navy">{confirmedBooking.route || confirmedBooking.destination}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Lead Passenger:</span>
                  <span className="font-semibold text-gray-900">{confirmedBooking.customerName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Contact Email:</span>
                  <span className="font-medium text-gray-800">{confirmedBooking.customerEmail}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Travel Date:</span>
                  <span className="font-semibold text-gray-900">{confirmedBooking.travelDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Total Travelers:</span>
                  <span className="font-bold text-gray-900">{confirmedBooking.travelers} Persons</span>
                </div>
                {confirmedBooking.voucherCode && (
                  <div className="flex justify-between border-b pb-2 text-emerald-700 font-semibold">
                    <span>Applied 20% Voucher ({confirmedBooking.voucherCode}):</span>
                    <span>- ৳{confirmedBooking.discountAmountBDT?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-base">
                  <span className="font-extrabold text-navy">Total Demo Cost:</span>
                  <span className="font-black text-ocean text-lg">
                    ৳{confirmedBooking.totalAmountBDT?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 font-bold text-xs md:text-sm text-gray-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Booking Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy hover:bg-navy-light text-white font-bold text-xs md:text-sm transition-colors shadow-md"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Service & Route Info Banner */}
              <div className="bg-teal/15 border border-teal/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-ocean">Selected Experience:</span>
                  <h4 className="font-bold text-navy text-sm md:text-base">{formData.itemName}</h4>
                  <p className="text-xs text-gray-600">{formData.route}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Estimate / Person:</span>
                  <div className="font-black text-ocean text-lg">৳{basePriceBDT.toLocaleString()}</div>
                </div>
              </div>

              {/* Traveler Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-ocean" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-ocean" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. tanvir@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-ocean" /> Phone Number (BD) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1712-345678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-ocean" /> Number of Travelers *
                  </label>
                  <select
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler (Solo)' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ocean" /> Departure Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ocean" /> Return Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm"
                  />
                </div>
              </div>

              {/* Loyalty Reward Voucher Code Section */}
              <div className="bg-gradient-to-r from-gray-50 to-teal/10 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-accent-coral" /> Have a 20% Reward Voucher?
                  </label>
                  <span className="text-[11px] text-teal-dark font-medium">TripMate Loyalty Program</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.voucherCode}
                    onChange={(e) => setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. TRIPMATE20-DXB24"
                    disabled={!!voucherApplied}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase focus:ring-2 focus:ring-ocean focus:border-ocean disabled:bg-gray-100"
                  />
                  {voucherApplied ? (
                    <button
                      type="button"
                      onClick={() => {
                        setVoucherApplied(null);
                        setFormData({ ...formData, voucherCode: '' });
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={validatingVoucher || !formData.voucherCode.trim()}
                      className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {validatingVoucher ? 'Checking...' : 'Apply'}
                    </button>
                  )}
                </div>

                {voucherApplied && (
                  <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Voucher Applied! 20% discount applied to your booking.</span>
                  </div>
                )}
                {voucherError && (
                  <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{voucherError}</span>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Special Requests or Dietary Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="e.g. Halal meal preference, airport wheelchair assistance, twin beds"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ocean focus:border-ocean text-sm"
                />
              </div>

              {/* Cost Summary Box */}
              <div className="bg-navy text-white rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Base Rate ({formData.travelers} × ৳{basePriceBDT.toLocaleString()}):</span>
                  <span>৳{rawTotal.toLocaleString()}</span>
                </div>
                {voucherApplied && (
                  <div className="flex justify-between text-xs text-teal font-semibold">
                    <span>Loyalty 20% Discount:</span>
                    <span>- ৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-teal font-bold">Estimated Total:</span>
                    <p className="text-[10px] text-white/50">*Demo estimate in Bangladeshi Taka (BDT)</p>
                  </div>
                  <span className="text-2xl font-black text-white">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-gray-500 leading-tight">
                * By submitting this booking, you create an official reservation inquiry in the TripMate international system. All rates and flight schedules are demo estimates for vacation planning purposes.
              </p>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 rounded-xl bg-ocean hover:bg-ocean-dark text-white text-xs md:text-sm font-extrabold shadow-lg shadow-ocean/30 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {submitting ? 'Submitting Reservation...' : 'Confirm Demo Reservation'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
