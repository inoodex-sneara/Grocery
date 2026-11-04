"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatTaka } from "@/lib/currency";
import { removeLightImageBackground } from "@/lib/removeLightImageBackground";

interface FlyingCartItem {
  eventId: number;
  image: string;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  arcX: number;
  arcY: number;
  size: number;
}

export default function FloatingCart() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);
  const [stickyBarHeight, setStickyBarHeight] = useState(0);
  const [flyingItem, setFlyingItem] = useState<FlyingCartItem | null>(null);

  const items = useCartStore((state) => state.items);
  const lastAddedItem = useCartStore((state) => state.lastAddedItem);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const basketRef = useRef<HTMLDivElement | null>(null);
  const lastAnimatedEventRef = useRef<number | null>(null);
  const flightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addClickOriginRef = useRef<{
    x: number;
    y: number;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track sticky bottom bar and footer positions so floating cart never overlaps either
  useEffect(() => {
    const handleLayout = () => {
      // 1. Check if quick-add sticky bottom bar exists (e.g. on product detail page)
      const stickyBar = document.querySelector('aside[aria-label="Quick add sticky bar"]');
      if (stickyBar) {
        const rect = stickyBar.getBoundingClientRect();
        if (rect.height > 0 && rect.bottom >= window.innerHeight - 20) {
          setStickyBarHeight(rect.height);
        } else {
          setStickyBarHeight(0);
        }
      } else {
        setStickyBarHeight(0);
      }

      // 2. Check footer position so cart floats above the footer before scrolling past it
      const footer = document.querySelector("footer");
      if (!footer) {
        setFooterOffset(0);
        return;
      }
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (footerRect.top < windowHeight) {
        // Footer is entering the viewport - push cart up
        setFooterOffset(windowHeight - footerRect.top);
      } else {
        setFooterOffset(0);
      }
    };

    window.addEventListener("scroll", handleLayout, { passive: true });
    window.addEventListener("resize", handleLayout, { passive: true });
    handleLayout();

    // Use MutationObserver so if sticky bar is dismissed or rendered, position updates immediately
    const observer = new MutationObserver(handleLayout);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", handleLayout);
      window.removeEventListener("resize", handleLayout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickCapture = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      const rect = button?.getBoundingClientRect();
      addClickOriginRef.current = {
        x: rect ? rect.left + rect.width / 2 : event.clientX,
        y: rect ? rect.top + rect.height / 2 : event.clientY,
        timestamp: Date.now(),
      };
    };

    document.addEventListener("click", handleClickCapture, true);
    return () => document.removeEventListener("click", handleClickCapture, true);
  }, []);

  useEffect(() => {
    if (
      !mounted ||
      !lastAddedItem ||
      lastAddedItem.eventId === lastAnimatedEventRef.current
    ) {
      return;
    }

    lastAnimatedEventRef.current = lastAddedItem.eventId;
    if (
      pathname?.startsWith("/checkout") ||
      pathname?.startsWith("/confirmation") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const clickOrigin = addClickOriginRef.current;
    const hasRecentClick = clickOrigin && Date.now() - clickOrigin.timestamp < 1500;
    const size = 144;
    const x = hasRecentClick
      ? clickOrigin.x - size / 2
      : window.innerWidth / 2 - size / 2;
    const initialY = hasRecentClick
      ? clickOrigin.y - size / 2
      : 0;
    let cancelled = false;

    const animateAddedItem = async () => {
      try {
        const image = await removeLightImageBackground(lastAddedItem.image);
        if (cancelled) return;

        const target = basketRef.current ?? pillRef.current;
        if (!target) return;

        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height * 0.68;
        const y = hasRecentClick
          ? initialY
          : Math.max(0, targetY - 240);
        const deltaX = targetX - x - size / 2;
        const deltaY = targetY - y - size / 2;

        setFlyingItem({
          eventId: lastAddedItem.eventId,
          image,
          x,
          y,
          deltaX,
          deltaY,
          arcX: deltaX * 0.5,
          arcY: deltaY * 0.5 - 90,
          size,
        });
        if (flightTimeoutRef.current) clearTimeout(flightTimeoutRef.current);
        flightTimeoutRef.current = setTimeout(() => setFlyingItem(null), 1400);
      } catch (error) {
        console.error("Could not prepare the product image for the cart animation.", error);
      }
    };

    void animateAddedItem();
    return () => {
      cancelled = true;
    };
  }, [lastAddedItem, mounted, pathname]);

  useEffect(
    () => () => {
      if (flightTimeoutRef.current) clearTimeout(flightTimeoutRef.current);
    },
    [],
  );

  // Do NOT show on checkout or payment/confirmation pages
  if (
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/confirmation")
  ) {
    return null;
  }

  if (!mounted || items.length === 0) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 select-none touch-manipulation font-sans transition-[bottom] duration-200 ease-out"
        style={{
          bottom: `calc(${stickyBarHeight > 0 ? `${stickyBarHeight + 14}px` : "1.5rem"} + ${footerOffset}px)`,
        }}
      >
      {/* =========================================
          DYNAMIC ISLAND FLOATING CART PILL
          - Compact default state: [Bag + badge] [Wave] CART | Tk ...
          - On click: Expands smoothly to show [View Drawer] and [Checkout →]
         ========================================= */}
      <div
        ref={pillRef}
        className="group relative flex items-center rounded-full border border-white/20 bg-black/95 px-4 sm:px-5 py-2.5 sm:py-3 text-white shadow-2xl shadow-black/70 backdrop-blur-md transition-all duration-300 ease-out hover:border-white/40"
      >
        <span
          aria-hidden="true"
          className="floating-cart-glow pointer-events-none absolute inset-0 rounded-full"
        />

        {/* Left Section: Bag, Wave, CART & Price (Click opens Drawer) */}
        <button
          type="button"
          onClick={openDrawer}
          aria-label={`Open cart with ${totalQuantity} items, total ${formatTaka(subtotal)}`}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none active:scale-95 transition-transform shrink-0"
        >
          {/* Bag Icon with Red Notification Badge */}
          <div
            ref={basketRef}
            className="relative flex h-8 w-8 items-center justify-center shrink-0 rounded-xl border border-amber-300/25 bg-gradient-to-br from-amber-200/15 via-yellow-600/10 to-amber-950/30 shadow-[inset_0_1px_0_rgb(255_255_255/12),0_2px_8px_rgb(0_0_0/25)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 36 36"
              fill="none"
              className={`h-5 w-5 sm:h-5.5 sm:w-5.5 transition-transform duration-200 group-hover:scale-110 ${
                flyingItem ? "floating-cart-basket-grow" : ""
              }`}
            >
              <defs>
                <linearGradient id="premiumBasketGold" x1="8" y1="8" x2="29" y2="30">
                  <stop stopColor="#FFE8A3" />
                  <stop offset=".48" stopColor="#D99A3D" />
                  <stop offset="1" stopColor="#9A5A1D" />
                </linearGradient>
                <linearGradient id="premiumBasketWeave" x1="9" y1="17" x2="27" y2="29">
                  <stop stopColor="#F4C979" />
                  <stop offset="1" stopColor="#A9682A" />
                </linearGradient>
                <clipPath id="premiumBasketClip">
                  <path d="M7 15c7 2.8 15 2.8 22 0l-2 13c-5.7 2.2-12.3 2.2-18 0L7 15Z" />
                </clipPath>
              </defs>
              <path
                d="M11 16 13 9c2.8-3.1 7.2-3.1 10 0l2 7"
                stroke="url(#premiumBasketGold)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M12.5 15.5c-.2-3.7 1.8-6 5.5-6s5.7 2.3 5.5 6"
                stroke="#FFE8A3"
                strokeOpacity=".65"
                strokeWidth=".8"
                strokeLinecap="round"
              />
              <path
                d="M14 15c-.5-2.6.1-4.4 1.8-5.4 1.3 1.8 1.2 3.8-.4 5.8M20.2 15c1.8-2.3 3.4-2.6 4.8-2.2-.2 2-1.6 3.1-4.4 3.3"
                fill="#7EAC53"
                stroke="#C8E18A"
                strokeWidth=".8"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 15c-.8-2.8.2-4.5 2.2-4.8 1.5 1.7 1 3.5-.8 4.8"
                fill="#D75C43"
                stroke="#FFC18B"
                strokeWidth=".8"
              />
              <path
                d="M7 15c7 2.8 15 2.8 22 0l-2 13c-5.7 2.2-12.3 2.2-18 0L7 15Z"
                fill="url(#premiumBasketWeave)"
                fillOpacity=".42"
                stroke="url(#premiumBasketGold)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <g
                clipPath="url(#premiumBasketClip)"
                stroke="#FFE4A3"
                strokeOpacity=".78"
                strokeWidth=".8"
              >
                <path d="M6 19c7 2.4 17 2.4 24 0M6 23c7 2.4 17 2.4 24 0M7 27c7 2.2 15 2.2 22 0" />
                <path d="m12 16 1.4 14m5-13v15m5-15-1.3 14" stroke="#8F541F" />
              </g>
              <path
                d="M7 15c7 2.8 15 2.8 22 0"
                stroke="#FFF0C4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M10 28.5c5.2 1.5 10.8 1.5 16 0" stroke="#FFF0C4" strokeOpacity=".55" strokeWidth=".8" strokeLinecap="round" />
            </svg>
            {totalQuantity > 0 && (
              <span
                key={totalQuantity}
                className="floating-cart-pop absolute -right-2 -top-1.5 flex h-4 min-w-4 sm:h-4.5 sm:min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] sm:text-[11px] font-black text-white shadow-xs ring-2 ring-black"
              >
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </div>

          {/* Equalizer Wave Bars */}
          <span className="flex h-3.5 sm:h-4 items-center gap-[2.5px]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((bar) => (
              <span
                key={bar}
                className="floating-cart-wave block w-[2.5px] rounded-full bg-red-500"
                style={{ animationDelay: `${bar * 90}ms` }}
              />
            ))}
          </span>

          {/* Text: Cart */}
          <span className="text-xs sm:text-sm font-extrabold text-red-500 tracking-wider uppercase">
            Cart
          </span>

          <div className="h-4 sm:h-4.5 w-px bg-white/20" />

          {/* Subtotal Price */}
          <span
            key={subtotal}
            className="floating-cart-pop text-xs sm:text-sm font-black tabular-nums text-white tracking-tight"
          >
            {formatTaka(subtotal)}
          </span>
        </button>

      </div>
      </div>
      {mounted &&
        flyingItem &&
        createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[120]"
            aria-hidden="true"
          >
            <div
              key={flyingItem.eventId}
              className="floating-cart-item-flight absolute"
              style={
                {
                  left: flyingItem.x,
                  top: flyingItem.y,
                  width: flyingItem.size,
                  height: flyingItem.size,
                  "--flight-x": `${flyingItem.deltaX}px`,
                  "--flight-y": `${flyingItem.deltaY}px`,
                  "--flight-arc-x": `${flyingItem.arcX}px`,
                  "--flight-arc-y": `${flyingItem.arcY}px`,
                } as CSSProperties
              }
            >
              <Image
                src={flyingItem.image}
                alt=""
                fill
                sizes="144px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
