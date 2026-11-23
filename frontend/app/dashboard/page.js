'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Calendar, Clock, MapPin, Tag, Gift, Star, 
  CheckCircle2, AlertCircle, FileText, Sparkles, Copy, 
  LogOut, PlusCircle, ArrowRight, Printer, ShieldCheck
} from 'lucide-react';
import RewardProgressCard from '../../components/RewardProgressCard';
import BookingModal from '../../components/BookingModal';
import api from '../../lib/api';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'submit-review' | 'reviews' | 'rewards'
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [reviewFormData, setReviewFormData] = useState({
    bookingId: '',
    destination: 'Dubai, UAE',
    hotelName: 'TripMate Dubai Partner Hotel (Demo)',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Selected Booking Voucher Modal
  const [selectedBookingReceipt, setSelectedBookingReceipt] = useState(null);

  // New Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('tripmate_token') : null;
    const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('tripmate_user') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    if (localUserStr) {
      try {
        const parsed = JSON.parse(localUserStr);
        setUser(parsed);
      } catch (e) {}
    }

    // Load user profile & data
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, rewardsRes, reviewsRes] = await Promise.allSettled([
        api.getMyBookings(),
        api.getMyRewards(),
        api.getMyReviews()
      ]);

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data) {
        setBookings(bookingsRes.value.data);
      }
      if (rewardsRes.status === 'fulfilled' && rewardsRes.value?.data) {
        setRewards(rewardsRes.value.data);
      }
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data) {
        setReviews(reviewsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const payload = {
        bookingId: reviewFormData.bookingId || undefined,
        destination: reviewFormData.destination,
        hotelName: reviewFormData.hotelName,
        rating: parseInt(reviewFormData.rating, 10),
        comment: reviewFormData.comment
      };

      await api.createReview(payload);
      setReviewSuccess('Your review has been submitted for verification! Once approved by admin, it will count towards your 20% discount voucher.');
      setReviewFormData({
        bookingId: '',
        destination: 'Dubai, UAE',
        hotelName: 'TripMate Dubai Partner Hotel (Demo)',
        rating: 5,
        comment: ''
      });
      // Refresh reviews & rewards
      loadData();
      setActiveTab('reviews');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  if (loading && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-ocean border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading your TripMate account...</p>
        </div>
      </div>
    );
  }

  const approvedCount = rewards?.approvedReviewsCount || 0;
  const neededCount = rewards?.reviewsNeededForDiscount || 3;
  const isUnlocked = rewards?.hasUnlockedDiscount || approvedCount >= neededCount;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-7xl">
      
      {/* Top Profile Header Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy text-white rounded-3xl p-6 md:p-8 shadow-xl border border-teal/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ocean/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal/20 border border-teal/40 flex items-center justify-center text-teal font-black text-2xl shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white">{user?.name || 'Tanvir Ahmed'}</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal text-navy uppercase tracking-wider">
                  Verified Traveler
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">{user?.email || 'tanvir@example.com'} • {user?.phone || '+880 1712-345678'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setBookingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-dark text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Trip</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 text-xs font-medium border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Loyalty Progress Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Gift className="w-4 h-4 text-accent-coral" />
            <span>
              Loyalty 20% Partner Hotel Voucher Progress: 
              <strong className="text-teal ml-1.5">{approvedCount} of {neededCount} Reviews Approved</strong>
            </span>
          </div>

          {isUnlocked ? (
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Voucher Unlocked! Valid for 20% OFF at TripMate Partner Hotel</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('submit-review')}
              className="text-teal hover:underline font-bold flex items-center gap-1"
            >
              <span>Submit a Review to Unlock 20% OFF</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'bookings', label: `My Bookings (${bookings.length})`, icon: Calendar },
          { id: 'submit-review', label: 'Submit a Review', icon: Star },
          { id: 'reviews', label: `My Reviews (${reviews.length})`, icon: FileText },
          { id: 'rewards', label: 'Loyalty Rewards (20% OFF)', icon: Gift }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'border-ocean text-ocean bg-ocean/5 rounded-t-xl'
                  : 'border-transparent text-gray-500 hover:text-navy hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* Tab 1: My Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Your Reservations & Booking Inquiries</h2>
            <span className="text-xs text-gray-500">All prices in Bangladeshi Taka (BDT)</span>
          </div>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-ocean">
                        Ref: {booking.referenceNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        booking.status === 'CONFIRMED' || booking.status === 'CONFIRMED_DEMO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-navy text-base mb-1">
                      {booking.selectedItem || booking.bookingType}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{booking.route || booking.destination}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-3">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase">Travel Date</span>
                        <span className="font-semibold text-gray-800">{booking.travelDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase">Travelers</span>
                        <span className="font-semibold text-gray-800">{booking.travelers} Persons</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">Total Demo Amount</span>
                      <span className="font-black text-ocean text-lg">
                        ৳{booking.totalAmountBDT?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBookingReceipt(booking)}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy mb-1">No Bookings Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                You haven’t submitted any booking requests yet. Explore our flight search, Dubai Explorer package, or Smart Planner to get started!
              </p>
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="px-5 py-2.5 bg-navy text-white text-xs font-bold rounded-xl"
              >
                Create a Demo Reservation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Submit a Verified Review */}
      {activeTab === 'submit-review' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 space-y-6">
          <div className="border-b pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-coral/15 text-accent-coral text-xs font-bold uppercase mb-2">
              <Star className="w-3.5 h-3.5 fill-accent-coral" />
              <span>Loyalty Milestone</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-navy">Submit a Verified Travel Review</h2>
            <p className="text-gray-500 text-xs mt-1">
              Share your honest feedback regarding your completed Dubai trip. 3 verified reviews automatically generate a <strong>20% discount voucher</strong> for our selected Partner Hotel.
            </p>
          </div>

          {reviewSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{reviewSuccess}</span>
            </div>
          )}

          {reviewError && (
            <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{reviewError}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Associated Booking (Optional)</label>
              <select
                value={reviewFormData.bookingId}
                onChange={(e) => setReviewFormData({ ...reviewFormData, bookingId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean bg-white"
              >
                <option value="">Select a completed booking (or general trip)</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.selectedItem || b.bookingType} (Ref: {b.referenceNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Destination / City *</label>
                <input
                  type="text"
                  required
                  value={reviewFormData.destination}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, destination: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Hotel or Tour Experience *</label>
                <input
                  type="text"
                  required
                  value={reviewFormData.hotelName}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, hotelName: e.target.value })}
                  placeholder="e.g. TripMate Dubai Partner Hotel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Rating *</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= reviewFormData.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-700 ml-2">
                  {reviewFormData.rating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Your Detailed Feedback *</label>
              <textarea
                required
                rows={4}
                value={reviewFormData.comment}
                onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                placeholder="Share your experience regarding room comfort, staff courtesy, distance to Dubai attractions, or flight transit..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-3 bg-ocean hover:bg-ocean-dark text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-ocean/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingReview ? 'Submitting Review...' : 'Submit for Verification'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: My Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">My Submitted Reviews</h2>
              <p className="text-xs text-gray-500">Reviews are verified by our team before unlocking reward milestones.</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('submit-review')}
              className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl"
            >
              + Write New Review
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-navy text-sm">{rev.hotelName || rev.destination}</h4>
                      <p className="text-xs text-gray-400">{rev.destination}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.status === 'APPROVED' ? 'Verified ✓' : rev.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="text-[10px] text-gray-400 pt-1 border-t">
                    Submitted on: {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy mb-1">No Reviews Submitted Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Submit reviews for your trips to collect 3 verified reviews and unlock your 20% discount code!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('submit-review')}
                className="px-5 py-2.5 bg-ocean text-white text-xs font-bold rounded-xl"
              >
                Submit Your First Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Loyalty Rewards */}
      {activeTab === 'rewards' && (
        <div className="space-y-8">
          <RewardProgressCard
            onBookPartnerHotel={() => setBookingModalOpen(true)}
          />
        </div>
      )}

      {/* Receipt Modal */}
      {selectedBookingReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border space-y-4">
            <div className="text-center pb-3 border-b">
              <h3 className="text-lg font-black text-navy">TripMate Travel Voucher</h3>
              <p className="text-xs text-gray-500">Booking Reference: {selectedBookingReceipt.referenceNumber}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Service:</span>
                <span className="font-bold text-navy">{selectedBookingReceipt.selectedItem || selectedBookingReceipt.bookingType}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Route / Area:</span>
                <span className="font-semibold text-gray-800">{selectedBookingReceipt.route || selectedBookingReceipt.destination}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Lead Passenger:</span>
                <span className="font-semibold text-gray-800">{selectedBookingReceipt.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Travel Date:</span>
                <span className="font-semibold text-gray-800">{selectedBookingReceipt.travelDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-gray-500">Travelers:</span>
                <span className="font-bold text-gray-800">{selectedBookingReceipt.travelers} Persons</span>
              </div>
              <div className="flex justify-between pt-2 text-sm">
                <span className="font-extrabold text-navy">Total Demo Cost:</span>
                <span className="font-black text-ocean">৳{selectedBookingReceipt.totalAmountBDT?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBookingReceipt(null)}
                className="flex-1 py-2.5 bg-navy text-white rounded-xl text-xs font-bold hover:bg-navy-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialBookingType="PACKAGE"
        initialItemName="Dhaka to Dubai – Dubai Explorer"
        initialPriceBDT={85000}
        initialTravelers={2}
        initialRoute="Dhaka (DAC) ➔ Dubai"
      />
    </div>
  );
}
