'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      if (res && res.user) {
        if (res.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    api.login({ email: demoEmail, password: demoPassword })
      .then((res) => {
        if (res.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      })
      .catch((err) => {
        setError(err.message || 'Demo login failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/20 text-ocean text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-coral" />
            <span>TripMate Account</span>
          </div>
          <h1 className="text-2xl font-black text-navy">Welcome Back</h1>
          <p className="text-gray-500 text-xs mt-1">
            Access your Dubai bookings, travel planner, and loyalty rewards
          </p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 block">
            ⚡ Quick 1-Click Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('tanvir@example.com', '123456')}
              className="px-3 py-2 bg-white hover:bg-teal/20 border border-gray-300 rounded-xl text-xs font-bold text-navy flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-ocean" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@tripmate.com', '123456')}
              className="px-3 py-2 bg-navy hover:bg-navy-light text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-ocean"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ocean hover:bg-ocean-dark text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-ocean/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In to TripMate'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-ocean hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
