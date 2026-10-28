"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="w-full space-y-4 sm:space-y-6">
      {/* Section Sub-heading / Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
         
          <h2 className="text-lg sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
            Special Deals &amp; Daily Offers
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#74B83E] hover:text-[#5fa02f] transition-colors group"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2-Column Split Banners: Fresh Meat & Fresh Fish */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Fresh Meat Banner */}
        <Link
          href="/category/meats"
          className="group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 bg-amber-50"
        >
          <div className="relative w-full aspect-[1086/383]">
            <Image
              src="/products/banner-fresh-meat.jpeg"
              alt="Fresh Meat - Shop Now"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
            {/* Subtle gloss hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
        </Link>

        {/* Fresh Fish Banner */}
        <Link
          href="/category/meats"
          className="group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 bg-emerald-50"
        >
          <div className="relative w-full aspect-[1086/383]">
            <Image
              src="/products/banner-fresh-fish.jpeg"
              alt="Fresh Fish - Shop Now"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
            {/* Subtle gloss hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
        </Link>
      </div>

      {/* Compact Featured Banner: Stock Up On Essentials */}
      <Link
        href="/shop"
        className="group relative block w-full max-w-[1480px] mx-auto overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 bg-emerald-900"
      >
        <div className="relative w-full h-[140px] xs:h-[170px] sm:h-[210px] md:h-[250px] lg:h-[280px]">
          <Image
            src="/products/banner-big-essentials.jpeg"
            alt="Stock Up On Essentials - Shop Now"
            fill
            sizes="(max-width: 1480px) 100vw, 1480px"
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
          {/* Subtle gloss hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>
    </section>
  );
}
