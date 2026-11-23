'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, Calendar, DollarSign, Star, Tag, 
  Check, X, AlertCircle, RefreshCw, Eye, MessageSquare, LogOut, ArrowRight 
} from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'bookings' | 'vouchers' | 'inquiries'
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
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
        if (parsed.role !== 'ADMIN') {
          // Non-admin redirect or alert
          setActionError('Admin privileges required. Please sign in as an admin.');
        }
      } catch (e) {}
    }

    fetchAdminData();
  }, [router]);

  const fetchAdminData = async () => {
    setLoading(true);
    setActionMessage('');
    setActionError('');
    try {
      const [statsRes, bookingsRes, reviewsRes, vouchersRes, inquiriesRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getAllBookings(),
        api.getAllReviews(),
        api.getAllVouchers(),
        api.getContactMessages()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data) {
        setBookings(bookingsRes.value.data);
      }
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data) {
        setReviews(reviewsRes.value.data);
      }
      if (vouchersRes.status === 'fulfilled' && vouchersRes.value?.data) {
        setVouchers(vouchersRes.value.data);
      }
      if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value?.data) {
        setInquiries(inquiriesRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
      setActionError('Failed to load admin dataset');
    } finally {
      setLoading(false);
    }
  };

  // Handle Review Verification
  const handleVerifyReview = async (reviewId, status) => {
    try {
      const res = await api.verifyReview(reviewId, status);
      let msg = `Review marked as ${status}!`;
      if (res.voucherGenerated) {
        msg += ` 🎉 Milestone achieved: 20% discount voucher ${res.voucher?.code || ''} automatically generated for this customer!`;
      }
      setActionMessage(msg);
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Error updating review status');
    }
  };

  // Handle Booking Status Update
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setActionMessage(`Booking status updated to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      setActionError(err.message || 'Failed to update booking status');
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  const pendingReviews = reviews.filter(r => r.status === 'PENDING');

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-navy text-white p-6 md:p-8 rounded-3xl shadow-xl border border-teal/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal text-navy text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-ocean" />
            <span>TripMate Central Administration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Management Dashboard</h1>
          <p className="text-xs md:text-sm text-white/70 mt-1">
            Review verification queue, Dhaka-Dubai reservations, voucher issuance, and customer support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center justify-between">
          <span>{actionMessage}</span>
          <button type="button" onClick={() => setActionMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold rounded-2xl flex items-center justify-between">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-ocean" />
          </div>
          <div className="text-2xl font-black text-navy">{stats?.totalBookings || bookings.length}</div>
          <p className="text-[11px] text-gray-400 mt-0.5">Reservations registered</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-ocean">
            ৳{(stats?.totalRevenueBDT || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Total demo booking volume</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reviews</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingReviews.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Awaiting admin verification</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active 20% Vouchers</span>
            <Tag className="w-4 h-4 text-accent-coral" />
          </div>
          <div className="text-2xl font-black text-accent-coral">
            {stats?.activeVouchersCount || vouchers.length}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Unlocked via 3-review milestone</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'reviews', label: `Review Verification Queue (${pendingReviews.length})`, icon: Star },
          { id: 'bookings', label: `Booking Management (${bookings.length})`, icon: Calendar },
          { id: 'vouchers', label: `Issued Vouchers (${vouchers.length})`, icon: Tag },
          { id: 'inquiries', label: `Contact Inquiries (${inquiries.length})`, icon: MessageSquare }
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

      {/* TAB 1: REVIEW VERIFICATION QUEUE */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">Customer Review Verification</h2>
              <p className="text-xs text-gray-500">
                Approving a review updates the customer’s verified count. Once 3 approved reviews are reached, a <strong>20% discount voucher</strong> is automatically created!
              </p>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                    rev.status === 'PENDING' ? 'border-amber-300 bg-amber-50/20' : 'border-gray-100'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-navy text-sm">{rev.hotelName || rev.destination}</span>
                      <span className="text-xs text-gray-400">• {rev.destination}</span>
                      <div className="flex items-center text-amber-400 ml-2">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ml-auto md:ml-2 ${
                        rev.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        rev.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 italic bg-gray-50 p-3 rounded-xl">
                      "{rev.comment}"
                    </p>

                    <div className="text-[11px] text-gray-400 flex flex-wrap gap-4">
                      <span>Customer Email: <strong className="text-gray-700">{rev.userEmail || rev.userId}</strong></span>
                      <span>Date: {new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  {rev.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleVerifyReview(rev.id, 'APPROVED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Review</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVerifyReview(rev.id, 'REJECTED')}
                        className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No reviews waiting in the queue.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOKING MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">All Booking Requests</h2>
            <span className="text-xs text-gray-500">Total: {bookings.length} reservations</span>
          </div>

          {bookings.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-extrabold uppercase text-gray-500 border-b">
                  <tr>
                    <th className="p-3.5">Reference</th>
                    <th className="p-3.5">Lead Passenger</th>
                    <th className="p-3.5">Service / Route</th>
                    <th className="p-3.5">Travel Date</th>
                    <th className="p-3.5">Travelers</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-mono font-bold text-ocean">{b.referenceNumber}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900">{b.customerName}</div>
                        <div className="text-[11px] text-gray-400">{b.customerEmail} • {b.customerPhone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-navy">{b.selectedItem || b.bookingType}</div>
                        <div className="text-[11px] text-gray-400">{b.route || b.destination}</div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">{b.travelDate}</td>
                      <td className="p-3.5">{b.travelers} Pax</td>
                      <td className="p-3.5 font-black text-navy whitespace-nowrap">
                        ৳{b.totalAmountBDT?.toLocaleString()}
                        {b.voucherCode && (
                          <span className="block text-[10px] text-emerald-600 font-semibold">
                            (20% Code: {b.voucherCode})
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          b.status === 'CONFIRMED' || b.status === 'CONFIRMED_DEMO' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="bg-white border rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-ocean"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-xs text-gray-500">No booking requests found.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ISSUED VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">20% Partner Hotel Loyalty Vouchers</h2>
              <p className="text-xs text-gray-500">Generated automatically when travelers reach 3 verified reviews.</p>
            </div>
          </div>

          {vouchers.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-[11px] font-extrabold uppercase text-gray-500 border-b">
                  <tr>
                    <th className="p-3.5">Voucher Code</th>
                    <th className="p-3.5">Eligible Customer</th>
                    <th className="p-3.5">Discount Rate</th>
                    <th className="p-3.5">Applicable Hotel</th>
                    <th className="p-3.5">Expiration Date</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vouchers.map((v) => (
                    <tr key={v.id || v.code} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-mono font-bold text-emerald-700">{v.code}</td>
                      <td className="p-3.5 font-semibold text-gray-800">{v.userEmail || v.userId || 'tanvir@example.com'}</td>
                      <td className="p-3.5 font-extrabold text-accent-coral">{v.discountPercent || 20}% OFF</td>
                      <td className="p-3.5 text-navy font-medium">TripMate Dubai Partner Hotel (Demo)</td>
                      <td className="p-3.5 whitespace-nowrap">{new Date(v.expiresAt).toLocaleDateString()}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          v.isUsed ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {v.isUsed ? 'REDEEMED' : 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <Tag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No vouchers generated yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Customer Inquiries & Messages</h2>
            <span className="text-xs text-gray-500">Total: {inquiries.length} inquiries</span>
          </div>

          {inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-navy text-sm">{inq.subject || 'General Inquiry'}</span>
                    <span className="text-[11px] text-gray-400">{new Date(inq.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    From: <strong className="text-gray-800">{inq.name}</strong> ({inq.email} • {inq.phone || 'No phone'})
                  </div>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed">
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No customer messages received yet.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
