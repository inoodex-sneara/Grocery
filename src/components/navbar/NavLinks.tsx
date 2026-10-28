"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Apple,
  Carrot,
  Wheat,
  Beef,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function NavLinks() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const bestSellerColumns = [
    {
      title: "Fruits",
      icon: Apple,
      href: "/category/fruits",
      badge: "Fresh",
      items: [
        { name: "Apple", href: "/category/fruits/apple", isHot: true },
        { name: "Orange", href: "/category/fruits/orange" },
        { name: "Plum", href: "/category/fruits/plum" },
        { name: "Jamun Fruit", href: "/category/fruits/jamun-fruit" },
        { name: "Cherry", href: "/category/fruits/cherry", isNew: true },
        { name: "Elderberry", href: "/category/fruits/elderberry" },
        { name: "Watermelon", href: "/category/fruits/watermelon" },
      ],
    },
    {
      title: "Vegetables",
      icon: Carrot,
      href: "/category/vegetables",
      badge: "Organic",
      items: [
        { name: "Beetroot", href: "/category/vegetables/beetroot" },
        { name: "Broccoli", href: "/category/vegetables/broccoli", isHot: true },
        { name: "Capsicum", href: "/category/vegetables/capsicum" },
        { name: "Cucumber", href: "/category/vegetables/cucumber" },
        { name: "Potato", href: "/category/vegetables/potato" },
        { name: "Coriander", href: "/category/vegetables/coriander" },
        { name: "Parsley", href: "/category/vegetables/parsley" },
      ],
    },
    {
      title: "Grain Foods",
      icon: Wheat,
      href: "/category/grains",
      badge: "Natural",
      items: [
        { name: "Badam", href: "/category/grains/badam", isHot: true },
        { name: "Brown Rice", href: "/category/grains/brown-rice" },
        { name: "Green Peas", href: "/category/grains/green-peas" },
        { name: "Horse Gram", href: "/category/grains/horse-gram" },
        { name: "TM Rice", href: "/category/grains/tm-rice" },
        { name: "Parsley", href: "/category/grains/parsley" },
        { name: "Wheats", href: "/category/grains/wheats" },
      ],
    },
    {
      title: "Meats & Protein",
      icon: Beef,
      href: "/category/meats",
      badge: "100% Halal",
      items: [
        { name: "Chicken Breast", href: "/category/meats/chicken-brest", isHot: true },
        { name: "Chicken Boneless", href: "/category/meats/chicken-boneless" },
        { name: "Egg Curry", href: "/category/meats/egg-curry" },
        { name: "Fresh Meat", href: "/category/meats/fresh-meat" },
        { name: "Fish Curry", href: "/category/meats/fish-curry" },
        { name: "Mushroom", href: "/category/meats/mushroom" },
        { name: "Meat Curry", href: "/category/meats/meat-curry" },
      ],
    },
  ];

  return (
    <nav className="flex items-center gap-4 lg:gap-6 xl:gap-8 text-[15px] lg:text-[16px] xl:text-[17px] font-semibold text-zinc-900 whitespace-nowrap">
      {/* Home (Active style matching the screenshot) */}
      <Link
        href="/"
        className="text-[#74B83E] font-bold italic tracking-tight hover:text-[#649f35] transition-colors relative py-2"
      >
        Home
      </Link>

      {/* Shop */}
      <Link
        href="/shop"
        className="text-zinc-900 hover:text-[#74B83E] transition-colors py-2"
      >
        Shop
      </Link>

      {/* Best Sellers Mega Dropdown */}
      <div
        className="relative py-2 group"
        onMouseEnter={() => setActiveDropdown("bestsellers")}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === "bestsellers" ? null : "bestsellers")}
          className="inline-flex items-center gap-1.5 text-zinc-900 hover:text-[#74B83E] transition-colors cursor-pointer group"
        >
          <span>Best Sellers</span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
              activeDropdown === "bestsellers"
                ? "rotate-180 text-[#74B83E]"
                : "group-hover:text-[#74B83E] group-hover:rotate-180"
            }`}
          />
        </button>

        {/* Mega Menu Dropdown */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[820px] lg:w-[900px] xl:w-[980px] max-w-[95vw] z-50 transition-all duration-200 ${
            activeDropdown === "bestsellers" ? "block opacity-100" : "hidden group-hover:block"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-zinc-100 ring-1 ring-black/[0.04] p-5 lg:p-6 xl:p-7 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            {/* 4 Column Category Grid */}
            <div className="grid grid-cols-4 gap-4 lg:gap-5">
              {bestSellerColumns.map((col, idx) => {
                const IconComponent = col.icon;
                return (
                  <div key={idx} className="flex flex-col group/col">
                    {/* Category Header Banner with Icon & Link */}
                    <Link
                      href={col.href}
                      className="bg-gradient-to-r from-[#74B83E] to-[#609e30] hover:from-[#65a336] hover:to-[#538929] text-white px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-between select-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                          <IconComponent className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                        </div>
                        <span className="font-bold text-xs lg:text-[13px] tracking-wide">
                          {col.title}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover/col:translate-x-0.5 transition-transform" />
                    </Link>

                    {/* Category Items List with Interactive Hover Pills */}
                    <ul className="mt-3 space-y-1">
                      {col.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            href={item.href}
                            className="group/item flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs lg:text-[13px] text-zinc-600 hover:text-[#74B83E] hover:bg-emerald-50/70 transition-all duration-150"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover/item:bg-[#74B83E] group-hover/item:scale-125 transition-all shrink-0" />
                              <span className="font-medium group-hover/item:translate-x-0.5 transition-transform truncate">
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-1">
                              {item.isHot && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-amber-700 bg-amber-100 rounded-full tracking-wider uppercase">
                                  Hot
                                </span>
                              )}
                              {item.isNew && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 rounded-full tracking-wider uppercase">
                                  New
                                </span>
                              )}
                              <ChevronRight className="w-3 h-3 text-[#74B83E] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Mega Menu Bottom Bar with Promo & Action */}
            <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/70 -mx-5 lg:-mx-6 xl:-mx-7 -mb-5 lg:-mb-6 xl:-mb-7 px-5 lg:px-6 xl:px-7 py-3 rounded-b-2xl">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs shrink-0">
                  <Sparkles className="w-3 h-3" />
                </span>
                <span>
                  Weekly Special:{" "}
                  <strong className="text-zinc-900 font-semibold">
                    Up to 30% Off
                  </strong>{" "}
                  on Fresh Farm Picks
                </span>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#74B83E] hover:text-[#5fa02f] transition-colors group/all"
              >
                <span>Explore All Categories</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Of The Day */}
      <Link
        href="/deals"
        className="text-zinc-900 hover:text-[#74B83E] transition-colors py-2"
      >
        Deal Of The Day
      </Link>

      {/* Track Order */}
      <Link
        href="/track-order"
        className="text-zinc-900 hover:text-[#74B83E] transition-colors py-2"
      >
        Track Order
      </Link>

      {/* Contact Us */}
      <Link
        href="/contact"
        className="text-zinc-900 hover:text-[#74B83E] transition-colors py-2"
      >
        Contact Us
      </Link>
    </nav>
  );
}
