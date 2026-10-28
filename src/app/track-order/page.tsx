"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
    }, 600);
  };

  return (
    <div className="flex-1 bg-zinc-50/60 py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#74B83E]/10 text-[#74B83E] text-xs font-bold mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>Real-time Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Track Your Order
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600">
            Enter your order ID and registered email or phone to view real-time delivery status.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-zinc-900/5 border border-zinc-100 p-6 sm:p-8">
          <form onSubmit={handleTrack} className="space-y-4 sm:space-y-0 sm:flex sm:gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order ID (e.g. #GRO-2026-8941)"
                required
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#74B83E] focus:ring-2 focus:ring-[#74B83E]/15 transition-all"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email address or phone number"
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#74B83E] focus:ring-2 focus:ring-[#74B83E]/15 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-12 px-7 bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm disabled:opacity-70"
            >
              {isLoading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[2.2]" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Helper note */}
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
            <span>Don&apos;t know your Order ID? Check your confirmation SMS or email.</span>
            <Link href="/contact" className="text-[#74B83E] font-medium hover:underline hidden sm:inline">
              Need assistance?
            </Link>
          </div>
        </div>

        {/* Live Order Status Simulation */}
        {hasSearched && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-zinc-900/5 border border-zinc-100 p-6 sm:p-8 animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Order Status
                </span>
                <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
                  Order {orderId.startsWith("#") ? orderId : `#${orderId}`}
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                <Truck className="w-4 h-4" />
                <span>Out for Delivery</span>
              </div>
            </div>

            {/* Estimated Delivery Time */}
            <div className="my-6 p-4 rounded-xl bg-[#74B83E]/8 border border-[#74B83E]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#74B83E] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-600 font-medium">Estimated Arrival</p>
                  <p className="text-sm sm:text-base font-bold text-zinc-900">Today by 5:30 PM (Express 2-hr Delivery)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                <MapPin className="w-4 h-4 text-[#74B83E]" />
                <span>Delivery to your registered address</span>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="relative pt-6 pb-2">
              <div className="grid grid-cols-4 gap-2 relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-zinc-200 -z-0">
                  <div className="h-full bg-[#74B83E] w-3/4 transition-all duration-500" />
                </div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#74B83E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-zinc-900">Placed</span>
                  <span className="text-[10px] text-zinc-500">10:15 AM</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#74B83E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-zinc-900">Confirmed</span>
                  <span className="text-[10px] text-zinc-500">10:30 AM</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#74B83E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-zinc-900">Packed</span>
                  <span className="text-[10px] text-zinc-500">11:15 AM</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#74B83E] text-white ring-4 ring-[#74B83E]/20 flex items-center justify-center font-bold text-xs shadow-xs animate-pulse">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-[#74B83E]">On The Way</span>
                  <span className="text-[10px] text-zinc-500">Live</span>
                </div>
              </div>
            </div>

            {/* Rider Info & Help */}
            <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-700">
                  🛵
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Delivery Hero</p>
                  <p className="text-sm font-bold text-zinc-900">Karim Ahmed (Verified)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:+18004567890"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#74B83E]" />
                  <span>Call Rider</span>
                </a>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#74B83E] text-xs font-semibold text-white hover:bg-[#639f33] transition-colors"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
