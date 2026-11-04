"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { SHOP_CATEGORY_NAMES } from "@/data/shopCategories";

const CATEGORIES = [
  {
    id: "vegetables",
    name: SHOP_CATEGORY_NAMES.vegetables,
    icon: "/products/icon-vegetables.png",
    bgClass: "bg-[#e8f7ea]",
  },
  {
    id: "fruits",
    name: SHOP_CATEGORY_NAMES.fruits,
    icon: "/products/icon-fruits.png",
    bgClass: "bg-[#fdeeed]",
  },
  {
    id: "flour",
    name: SHOP_CATEGORY_NAMES.grains,
    icon: "/products/icon-flour.png",
    bgClass: "bg-[#e8f3fc]",
  },
  {
    id: "meat",
    name: SHOP_CATEGORY_NAMES.meat,
    icon: "/products/icon-meat.png",
    bgClass: "bg-[#fff6dc]",
  },
  {
    id: "eggs",
    name: SHOP_CATEGORY_NAMES.eggs,
    icon: "/products/icon-eggs.png",
    bgClass: "bg-[#ecf7e6]",
  },
  {
    id: "milk",
    name: SHOP_CATEGORY_NAMES.milk,
    icon: "/products/icon-milk.png",
    bgClass: "bg-[#fbebf6]",
  },
] as const;

export default function OurProducts() {
  return (
    <section className="w-full py-4 sm:py-6">
      <div className="relative mb-8 sm:mb-12">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center justify-center relative mb-1">
            <Leaf className="w-6 h-6 text-[#74B83E]/40 absolute -top-2 -right-4 rotate-12" />
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#74B83E] tracking-tight font-sans drop-shadow-2xs">
             Shop by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-2 leading-relaxed max-w-lg mx-auto">
            Mauris vitae ultricies leo integer malesuada nunc vel in arcu cursus
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7 lg:gap-8 flex-wrap">
          {CATEGORIES.map((cat) => {
            const href = `/shop?category=${encodeURIComponent(cat.name)}`;

            return (
              <Link key={cat.id} href={href} className="flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-[1.02]">
                <div
                  className={`relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[130px] lg:h-[130px] flex flex-col items-center justify-center ${cat.bgClass} text-zinc-800 shadow-2xs`}
                  style={{
                    borderRadius: "48% 52% 56% 44% / 46% 54% 46% 54%",
                  }}
                >
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 mb-1 sm:mb-1.5">
                    <Image src={cat.icon} alt={cat.name} fill className="object-contain" />
                  </div>

                  <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-tight text-center px-1 text-zinc-800">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
