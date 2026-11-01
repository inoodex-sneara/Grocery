"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="w-full overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="relative min-h-[540px] w-full bg-[#e4ffc4] sm:aspect-[3.15/1] sm:min-h-[400px]">
        <Image
          src="/shop/bg-1.webp"
          alt="Fresh groceries and vegetables"
          fill
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-center"
        />
        <div className="absolute inset-x-0 top-0 flex h-[58%] items-start justify-center bg-gradient-to-b from-[#e4ffc4] via-[#e4ffc4]/95 to-transparent px-5 pt-9 text-center sm:inset-y-0 sm:left-0 sm:h-auto sm:w-[52%] sm:items-center sm:bg-none sm:px-10 sm:pt-0 md:px-12">
          <div className="max-w-md">
            <h2 className="text-2xl font-extrabold italic leading-tight text-[#74B83E] sm:text-2xl md:text-3xl">
              Special Discount for All Grocery Products
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-zinc-800 sm:mt-4 sm:text-sm">
              Find fresh produce and everyday grocery essentials for your home.
              Shop your favorites today.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#74B83E] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#5fa02f] sm:mt-6 sm:text-sm"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
