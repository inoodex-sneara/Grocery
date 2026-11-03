"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Trash2, Plus, Minus, X } from "lucide-react";
import { CustomBagIcon } from "@/components/icons/CustomBagIcon";
import { useCartStore } from "@/store/cartStore";
import { formatTaka } from "@/lib/currency";

export default function FloatingCart() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Do NOT show on checkout or payment/confirmation pages
  if (
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/confirmation")
  ) {
    return null;
  }

  if (!mounted) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleMouseEnter = () => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250);
  };

  const handleTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
    openDrawer();
  };

  return (
    <div
      className="fixed right-0 top-[55%] sm:top-1/2 -translate-y-1/2 z-40 select-none touch-manipulation font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* =========================================
          FLOATING CART TAB (Right Edge)
         ========================================= */}
      <button
        type="button"
        onClick={handleTabClick}
        aria-label={`Open Cart (${totalQuantity} items)`}
        className="group relative flex items-center justify-center bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-l-2xl shadow-lg shadow-green-900/20 transition-all duration-300 sm:hover:-translate-x-1 cursor-pointer border-t border-b border-l border-white/20"
      >
        {/* Shopping Bag Icon with Count Badge */}
          <div className="relative">
            <CustomBagIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] group-hover:scale-105 transition-transform duration-200" />
            {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-zinc-950 text-[10px] sm:text-[11px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs ring-2 ring-[#74B83E]">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
          )}
              </div>
          </button>

          {/* =========================================
          HOVER FLYOUT PREVIEW CARD (DESKTOP ONLY)
         ========================================= */}
          {isHovered && (
            <div
              className="hidden md:flex flex-col absolute right-full top-1/2 -translate-y-1/2 mr-3 w-[350px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-zinc-200/90 p-4 transition-all duration-200 animate-in fade-in slide-in-from-right-4 zoom-in-95 pointer-events-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Pointer Arrow */}
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-zinc-200/90 rotate-45 transform" />

              {/* Header: Title, Count Badge, Close */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 shrink-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900">
                    Cart Summary
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#74B83E]/15 text-[#5e9930]">
                    {totalQuantity} {totalQuantity === 1 ? "Product" : "Products"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHovered(false)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Items List */}
              {items.length === 0 ? (
                <div className="py-8 text-center shrink-0">
                  <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2">
                    <CustomBagIcon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-800">Your cart is empty</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Add fresh grocery items from our shop!
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsHovered(false)}
                    className="mt-3 inline-block px-4 py-1.5 text-xs font-bold text-[#74B83E] border border-[#74B83E] hover:bg-[#74B83E] hover:text-white rounded-full transition-colors"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <>
                  {/* Product Rows */}
                  <div className="drawer-scroll flex-1 min-h-0 max-h-64 overflow-y-auto divide-y divide-zinc-100 pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 py-3 first:pt-2.5 last:pb-2.5"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-150 overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>

                        {/* Details & Controls */}
                        <div className="min-w-0 flex-1 flex flex-col justify-between">
                          {/* Top: Name & Remove */}
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-zinc-800 line-clamp-1 leading-snug">
                              {item.name}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-zinc-300 hover:text-red-500 transition-colors p-0.5 cursor-pointer shrink-0"
                              aria-label={`Remove ${item.name}`}
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Middle: Unit size */}
                          {item.unit && (
                            <span className="text-[11px] text-zinc-400">
                              {item.unit}
                            </span>
                          )}

                          {/* Bottom: Total Price & Stepper */}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-[#74B83E]">
                              {formatTaka(item.price * item.quantity)}
                            </span>

                            {/* Quantity Stepper */}
                            <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-zinc-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer: Subtotal & Actions */}
                  <div className="pt-3 border-t border-zinc-100 mt-2 space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium">Subtotal:</span>
                      <span className="text-base font-extrabold text-[#74B83E]">
                        {formatTaka(subtotal)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsHovered(false);
                          openDrawer();
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        View Drawer
                      </button>

                      <Link
                        href="/checkout"
                        onClick={() => setIsHovered(false)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#74B83E] hover:bg-[#639f33] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center shadow-sm cursor-pointer"
                      >
                        Checkout
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        );
}
