"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="mx-auto w-[94%] overflow-hidden rounded-2xl shadow-sm sm:w-full sm:rounded-3xl">
      <div className="relative h-[400px] w-full bg-[#e4ffc4] sm:h-[320px] md:h-[370px] lg:h-[420px] xl:h-[480px]">
        <Image
          src="/shop/bg-1.webp"
          alt="Fresh groceries and vegetables"
          fill
          sizes="100vw"
          className="hidden object-cover object-center sm:block"
        />
        <div className="absolute inset-x-0 bottom-0 h-[50%] sm:hidden">
          <Image
            src="/shop/bg-1.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex h-[50%] items-start justify-center bg-[#e4ffc4] px-4 pt-5 text-center sm:inset-y-0 sm:left-0 sm:h-auto sm:w-[52%] sm:items-center sm:bg-transparent sm:px-8 sm:pt-0 sm:text-left md:px-12">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-extrabold italic leading-tight text-[#74B83E] min-[380px]:text-2xl sm:text-2xl md:text-3xl">
              Special Discount for All Grocery Products
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-zinc-800 sm:mx-0 sm:mt-4 sm:text-sm">
              Find fresh produce and everyday grocery essentials for your home.
              Shop your favorites today.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#74B83E] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#5fa02f] sm:mt-6 sm:text-sm"
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
