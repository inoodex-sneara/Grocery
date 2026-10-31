"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Timer,
  ShoppingCart,
  Heart,
  Star,
  Check,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { DEAL_PRODUCTS, FEATURED_DEAL, type DealProduct } from "@/data/dealsData";

/* =========================================
   COUNTDOWN HOOK (end of today = daily deal)
 ========================================= */
function useDailyCountdown() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const endOfDay = end.getTime();

    const updateRemaining = () => {
      setRemaining(Math.max(0, endOfDay - Date.now()));
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
  };
}

/* =========================================
   COUNTDOWN BOX COMPONENT
 ========================================= */
function CountdownBox({
  value,
  label,
  size = "md",
}: {
  value: string;
  label: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${
          size === "lg"
            ? "w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl"
            : "w-11 h-11 sm:w-12 sm:h-12 text-base sm:text-lg"
        } rounded-xl bg-white text-zinc-900 font-extrabold flex items-center justify-center shadow-xs tabular-nums`}
      >
        {value}
      </div>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
        {label}
      </span>
    </div>
  );
}

/* =========================================
   STARS HELPER
 ========================================= */
function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 text-amber-400 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
          }`}
        />
      ))}
    </div>
  );
}

/* =========================================
   DEAL OF THE DAY PAGE
 ========================================= */
export default function DealsPage() {
  const { hours, minutes, seconds } = useDailyCountdown();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const featuredDiscount = Math.round(
    (1 - FEATURED_DEAL.price / FEATURED_DEAL.oldPrice) * 100
  );

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = DEAL_PRODUCTS.find((item) => item.id === id);
    if (product) {
      toggleWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        unit: product.unit,
        currency: "BDT",
      });
    }
  };

  const handleAddToCart = (product: DealProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      currency: "BDT",
      unit: product.unit,
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <div className="flex-1 bg-zinc-50/50 pb-16">
      {/* =========================================
          GREEN PAGE HEADER BANNER
         ========================================= */}
      <div className="w-full bg-gradient-to-r from-[#74B83E] to-[#63a032] text-white">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold tracking-wide mb-4">
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Today Only · Fresh Farm Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-lemonada">
            Deal Of The Day
          </h1>
          {/* Breadcrumb */}
          <nav className="mt-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-white/85 font-medium">
            <Link href="/" className="hover:text-white hover:underline transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Deal Of The Day</span>
          </nav>

          {/* Daily Countdown */}
          <div className="mt-6 inline-flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white/90 mr-1">
              <Timer className="w-4 h-4" />
              Hurry up! Offer ends in
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <CountdownBox value={hours} label="Hours" />
              <span className="text-xl font-bold text-white/70 -mt-4">:</span>
              <CountdownBox value={minutes} label="Minutes" />
              <span className="text-xl font-bold text-white/70 -mt-4">:</span>
              <CountdownBox value={seconds} label="Seconds" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-10 sm:pt-14 space-y-12 sm:space-y-16">
        {/* =========================================
            FEATURED DEAL (HERO CARD)
           ========================================= */}
        <section className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Featured Image */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-10 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-md z-10">
                -{featuredDiscount}% OFF
              </span>
              <Image
                src={FEATURED_DEAL.image}
                alt={FEATURED_DEAL.name}
                width={420}
                height={420}
                className="object-contain w-full max-w-[320px] sm:max-w-[420px] drop-shadow-xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>

            {/* Featured Details */}
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-[#74B83E]/10 text-[#74B83E] text-[11px] font-bold uppercase tracking-wide">
                <Tag className="w-3 h-3" />
                {FEATURED_DEAL.category} · Best Deal
              </span>

              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                <Link
                  href={`/products/${FEATURED_DEAL.slug}`}
                  className="transition-colors hover:text-[#54892f]"
                >
                {FEATURED_DEAL.name}
                </Link>
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <Stars rating={FEATURED_DEAL.rating} />
                <span className="text-xs text-zinc-500 font-semibold">
                  ({FEATURED_DEAL.rating}.0)
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-lg">
                Hand-picked premium quality {FEATURED_DEAL.name.toLowerCase()} sourced
                straight from organic partner farms. Limited stock at this price — once
                the daily deal resets, the offer is gone!
              </p>

              {/* Price */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#74B83E]">
                  Tk {FEATURED_DEAL.price}
                </span>
                <span className="text-lg text-zinc-400 line-through font-semibold">
                  Tk {FEATURED_DEAL.oldPrice}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-extrabold">
                  You save Tk {FEATURED_DEAL.oldPrice - FEATURED_DEAL.price}
                </span>
              </div>

              {/* Stock Progress Bar */}
              <div className="mt-5 max-w-md">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-600 mb-1.5">
                  <span>
                    Sold:{" "}
                    <span className="text-red-500">{FEATURED_DEAL.sold}</span> /{" "}
                    {FEATURED_DEAL.total}
                  </span>
                  <span className="text-zinc-400">Hurry, almost gone!</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#74B83E] to-[#8bd450] rounded-full transition-all duration-700"
                    style={{
                      width: `${(FEATURED_DEAL.sold / FEATURED_DEAL.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={`/products/${FEATURED_DEAL.slug}`}
                  className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-[#74B83E] hover:text-[#54892f]"
                >
                  View deal details
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(FEATURED_DEAL, e)}
                  className={`px-7 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                    addedItems[FEATURED_DEAL.id]
                      ? "bg-zinc-900 text-white"
                      : "bg-[#74B83E] hover:bg-[#639f33] text-white hover:scale-[1.02]"
                  }`}
                >
                  {addedItems[FEATURED_DEAL.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add To Cart</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(FEATURED_DEAL.id, e)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    wishlistItems.some((item) => item.id === FEATURED_DEAL.id)
                      ? "bg-red-500 text-white"
                      : "bg-emerald-50 text-[#74B83E] hover:bg-red-500 hover:text-white"
                  }`}
                  aria-label="Add to Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlistItems.some((item) => item.id === FEATURED_DEAL.id)
                        ? "fill-white"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#74B83E]" />
                  Free delivery over Tk 500
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#74B83E]" />
                  100% fresh guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#74B83E]" />
                  Easy 7-day returns
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            ALL DEALS SECTION HEADER
           ========================================= */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            {/* Decorative Leaves */}
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-10 h-7 text-[#74B83E]/80"
                viewBox="0 0 40 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 18C12 18 6 13 4 7C10 5 18 9 18 18Z"
                  fill="#74B83E"
                  fillOpacity="0.85"
                />
                <path
                  d="M20 2C24 8 23 15 20 22C17 15 16 8 20 2Z"
                  fill="#8bd450"
                  fillOpacity="0.9"
                />
                <path
                  d="M22 18C28 18 34 13 36 7C30 5 22 9 22 18Z"
                  fill="#74B83E"
                  fillOpacity="0.85"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#74B83E] tracking-tight font-lemonada">
              Today&apos;s Hot Deals
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-normal leading-relaxed">
              Grab today&apos;s freshest picks at unbeatable prices — offers reset at
              midnight, so stock up before they&apos;re gone!
            </p>
          </div>

          {/* =========================================
              DEAL PRODUCT GRID
             ========================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {DEAL_PRODUCTS.map((product) => {
              const discount = Math.round(
                (1 - product.price / product.oldPrice) * 100
              );
              const isWishlisted = wishlistItems.some(
                (item) => item.id === product.id,
              );
              const isAdded = !!addedItems[product.id];
              const soldPercent = (product.sold / product.total) * 100;

              const card = (
                <div className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col transition-all duration-300 hover:shadow-md overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative w-full h-36 sm:h-44 bg-zinc-50/70 rounded-xl flex items-center justify-center p-2 mb-3">
                    {/* Discount Badge */}
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-2xs select-none">
                      -{discount}%
                    </span>

                    {/* Per-product timer chip */}
                    {product.endsInHours && (
                      <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-zinc-900/90 shadow-2xs select-none flex items-center gap-1">
                        <Timer className="w-2.5 h-2.5" />
                        {product.endsInHours}h left
                      </span>
                    )}

                    <Link
                      href={`/products/${product.slug}`}
                      aria-label={`View ${product.name} deal details`}
                      className="absolute inset-0"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Floating actions on hover */}
                    <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-[#74B83E] transition-all duration-200 shadow-md cursor-pointer hover:scale-110"
                        title="Add to Cart"
                        aria-label="Add to Cart"
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-110 ${
                          isWishlisted
                            ? "bg-red-500 text-white"
                            : "bg-zinc-900 text-white hover:bg-red-500"
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 stroke-[2.5] ${
                            isWishlisted ? "fill-white" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                    {product.category}
                  </span>

                  {/* Name */}
                  <h3 className="mt-0.5 text-sm sm:text-base font-bold text-zinc-900 group-hover:text-[#74B83E] transition-colors truncate">
                    <Link href={`/products/${product.slug}`}>
                    {product.name}
                    </Link>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <Stars rating={product.rating} />
                    <span className="text-[11px] text-zinc-400 font-medium">
                      ({product.rating}.0)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm sm:text-base font-extrabold text-[#74B83E]">
                      Tk {product.price}
                    </span>
                    <span className="text-xs text-zinc-400 line-through font-normal">
                      Tk {product.oldPrice}
                    </span>
                  </div>

                  {/* Sold progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 mb-1">
                      <span>
                        Sold <span className="text-red-500">{product.sold}</span> /{" "}
                        {product.total}
                      </span>
                      <span>{Math.round(soldPercent)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          soldPercent >= 75
                            ? "bg-red-500"
                            : "bg-gradient-to-r from-[#74B83E] to-[#8bd450]"
                        }`}
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Mobile Add to Cart button */}
                  <div className="mt-3 sm:hidden">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`w-full text-xs font-bold px-3 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAdded
                          ? "bg-zinc-900 text-white"
                          : "bg-[#74B83E] text-white hover:bg-[#639f33]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );

              return (
                <div key={product.id} className="h-full">
                  {card}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
