"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  ChevronDown,
  ArrowRight,
  Apple,
  Carrot,
  Wheat,
  Beef,
} from "lucide-react";
import Logo from "./Logo";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const BEST_SELLER_CATEGORIES = [
  {
    title: "Fruits",
    icon: Apple,
    href: "/category/fruits",
    badge: "Fresh",
    items: [
      { name: "Apple", href: "/category/fruits/apple", isHot: true },
      { name: "Orange", href: "/category/fruits/orange" },
      { name: "Plum", href: "/category/fruits/plum" },
      { name: "Watermelon", href: "/category/fruits/watermelon" },
    ],
  },
  {
    title: "Vegetables",
    icon: Carrot,
    href: "/category/vegetables",
    badge: "Organic",
    items: [
      { name: "Broccoli", href: "/category/vegetables/broccoli", isHot: true },
      { name: "Capsicum", href: "/category/vegetables/capsicum" },
      { name: "Cucumber", href: "/category/vegetables/cucumber" },
      { name: "Potato", href: "/category/vegetables/potato" },
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
    ],
  },
];

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [isBestSellersOpen, setIsBestSellersOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 w-full max-w-xs sm:max-w-sm h-full max-h-screen max-h-dvh bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300 overflow-hidden font-lemonada"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <Logo />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links & Navigation */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-4 space-y-6 drawer-scroll"
          data-lenis-prevent
        >
          {/* Main Navigation */}
          <div>
           
            <div className="space-y-1">
              <Link
                href="/"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#74B83E] bg-[#74B83E]/10"
              >
                Home
              </Link>

              <Link
                href="/shop"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Shop
              </Link>

              {/* Best Sellers Accordion Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsBestSellersOpen(!isBestSellersOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isBestSellersOpen
                      ? "bg-[#74B83E]/10 text-[#74B83E] font-semibold"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Best Sellers</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold text-white bg-[#74B83E] rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isBestSellersOpen
                        ? "rotate-180 text-[#74B83E]"
                        : "text-zinc-400"
                    }`}
                  />
                </button>

                {/* Sub-menu Dropdown List */}
                {isBestSellersOpen && (
                  <div className="mt-2 ml-2 pl-3 border-l-2 border-[#74B83E]/40 space-y-3 py-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                    {BEST_SELLER_CATEGORIES.map((cat, idx) => {
                      const IconComponent = cat.icon;
                      return (
                        <div key={idx} className="space-y-1.5">
                          {/* Category Title Link */}
                          <Link
                            href={cat.href}
                            onClick={onClose}
                            className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-zinc-100/80 hover:bg-[#74B83E]/15 text-xs font-bold text-zinc-800 hover:text-[#74B83E] transition-colors"
                          >
                            <div className="flex items-center gap-1.5">
                              <IconComponent className="w-3.5 h-3.5 text-[#74B83E]" />
                              <span>{cat.title}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-zinc-500">
                              {cat.badge}
                            </span>
                          </Link>

                          {/* Items Grid */}
                          <div className="grid grid-cols-2 gap-1 px-1">
                            {cat.items.map((item, itemIdx) => (
                              <Link
                                key={itemIdx}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-zinc-600 hover:text-[#74B83E] hover:bg-zinc-50 transition-colors truncate"
                              >
                                <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                <span className="truncate">{item.name}</span>
                                {item.isHot && (
                                  <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 rounded shrink-0">
                                    ★
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                   
                  </div>
                )}
              </div>

              <Link
                href="/deals"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Deal Of The Day
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Wishlist
              </Link>

              <Link
                href="/track-order"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Track Order
              </Link>

              <Link
                href="/contact"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
