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
import {
  DEAL_PRODUCTS,
  FEATURED_DEAL,
  FEATURED_DEAL_IMAGE,
  type DealProduct,
} from "@/data/dealsData";

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
    <div className="flex-1 bg-[linear-gradient(180deg,#f6f9f2_0%,#ffffff_48%,#f8faf7_100%)] pb-16">
      {/* =========================================
          GREEN PAGE HEADER BANNER
         ========================================= */}
      <div className="relative isolate w-full overflow-hidden bg-[radial-gradient(ellipse_at_78%_10%,rgba(190,242,100,0.28),transparent_34%),linear-gradient(115deg,#183d26_0%,#245a31_48%,#397a32_100%)] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-40 h-[28rem] w-[28rem] rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-24 h-[20rem] w-[20rem] rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-[38%] h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-[1680px] items-center gap-8 px-4 py-9 sm:px-6 sm:py-12 md:px-8 lg:grid-cols-[1fr_auto] lg:px-10 lg:py-14 xl:px-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold tracking-wide shadow-sm backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>Today only <span className="mx-1 text-white/45">·</span> Fresh from the farm</span>
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Fresh deals, <span className="text-lime-200">better days.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Handpicked favourites at a little less. Shop today&apos;s best prices while they last.
            </p>
            <nav className="mt-5 flex items-center gap-1.5 text-xs font-medium text-white/65 sm:text-sm">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white/90">Deals of the day</span>
            </nav>
          </div>

          <div className="rounded-2xl border border-white/15 bg-black/10 p-4 shadow-xl shadow-black/10 backdrop-blur-sm sm:p-5">
            <div className="mb-3 flex items-center justify-center gap-2 text-xs font-bold text-white/85 sm:text-sm">
              <Timer className="h-4 w-4 text-lime-200" />
              Offers refresh in
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <CountdownBox value={hours} label="Hours" size="lg" />
              <span className="mt-3 text-xl font-bold text-white/45">:</span>
              <CountdownBox value={minutes} label="Minutes" size="lg" />
              <span className="mt-3 text-xl font-bold text-white/45">:</span>
              <CountdownBox value={seconds} label="Seconds" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1680px] space-y-12 px-3 pt-7 sm:space-y-16 sm:px-6 sm:pt-10 md:px-8 lg:px-10 xl:px-12">
        {/* =========================================
            FEATURED DEAL (HERO CARD)
           ========================================= */}
        <section className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            {/* Featured Image */}
            <div className="relative flex min-h-[290px] sm:min-h-[440px] items-center justify-center p-4 sm:p-8">
              <span className="absolute left-2 top-2 sm:left-4 sm:top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-red-900/15">
                <Zap className="h-3.5 w-3.5 fill-white" />
                -{featuredDiscount}% OFF
              </span>
              <Image
                src={FEATURED_DEAL_IMAGE}
                alt={FEATURED_DEAL.name}
                width={460}
                height={460}
                className="relative z-[1] w-full max-w-[340px] sm:max-w-[440px] object-contain drop-shadow-[0_24px_30px_rgba(30,41,20,0.16)] transition-transform duration-500 hover:scale-105"
                priority
              />
              <span className="absolute bottom-2 sm:bottom-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200/80 bg-white/95 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-800 shadow-md backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Fresh &amp; premium quality
              </span>
            </div>

            {/* Featured Details */}
            <div className="flex flex-col justify-center py-2 sm:py-5 lg:py-8">
              <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                <Tag className="w-3 h-3" />
                {FEATURED_DEAL.category} · Best Deal
              </span>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
                <Link
                  href={`/products/${FEATURED_DEAL.slug}`}
                  className="transition-colors hover:text-[#54892f]"
                >
                {FEATURED_DEAL.name}
                </Link>
              </h2>
              <span className="mt-1 text-xs font-semibold tracking-wide text-zinc-400">
                {FEATURED_DEAL.unit}
              </span>

              <div className="mt-2 flex items-center gap-2">
                <Stars rating={FEATURED_DEAL.rating} />
                <span className="text-xs text-zinc-500 font-semibold">
                  ({FEATURED_DEAL.rating}.0)
                </span>
              </div>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600">
                Hand-picked premium quality {FEATURED_DEAL.name.toLowerCase()} sourced
                straight from organic partner farms. Limited stock at this price — once
                the daily deal resets, the offer is gone!
              </p>

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-zinc-100 pt-4">
                <span className="text-3xl font-extrabold tracking-tight text-emerald-700 sm:text-4xl">
                  Tk {FEATURED_DEAL.price}
                </span>
                <span className="text-lg text-zinc-400 line-through font-semibold">
                  Tk {FEATURED_DEAL.oldPrice}
                </span>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-600 ring-1 ring-red-100">
                  You save Tk {FEATURED_DEAL.oldPrice - FEATURED_DEAL.price}
                </span>
              </div>

              {/* Stock Progress Bar */}
              <div className="mt-4 max-w-md rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-zinc-200/70">
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-zinc-600">
                  <span>
                    Sold:{" "}
                    <span className="text-red-500">{FEATURED_DEAL.sold}</span> /{" "}
                    {FEATURED_DEAL.total}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Timer className="h-3 w-3" />
                    Hurry, almost gone!
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200/70">
                  <div
                    className="h-full bg-gradient-to-r from-[#74B83E] to-[#8bd450] rounded-full transition-all duration-700"
                    style={{
                      width: `${(FEATURED_DEAL.sold / FEATURED_DEAL.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/products/${FEATURED_DEAL.slug}`}
                  className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  View deal details
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(FEATURED_DEAL, e)}
                  className={`px-7 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                    addedItems[FEATURED_DEAL.id]
                      ? "bg-zinc-900 text-white"
                      : "bg-emerald-700 text-white hover:scale-[1.02] hover:bg-emerald-800"
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
                      : "bg-emerald-50 text-emerald-700 hover:bg-red-500 hover:text-white"
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
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-4 text-xs font-semibold text-zinc-500 sm:gap-6">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-700" />
                  Free delivery over Tk 500
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  100% fresh guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4 text-emerald-700" />
                  Easy 7-day returns
                </span>
              </div>
            </div>
        </section>

        {/* =========================================
            ALL DEALS SECTION HEADER
           ========================================= */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Handpicked for you
              </span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                Today&apos;s <span className="text-emerald-700">hot deals</span>
              </h2>
              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-zinc-500 sm:text-sm">
                Fresh favourites and pantry staples at prices worth stocking up for.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-xs font-bold text-zinc-600 shadow-sm">
              <Tag className="h-3.5 w-3.5 text-emerald-700" />
              {DEAL_PRODUCTS.length} limited-time offers
            </span>
          </div>

          {/* =========================================
              DEAL PRODUCT GRID
             ========================================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-[0_8px_24px_-20px_rgba(24,56,35,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_20px_38px_-24px_rgba(24,56,35,0.38)] sm:p-4">
                  {/* Image */}
                  <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#f8faf5_58%,#eef4e9_100%)] p-2 sm:h-48">
                    <span aria-hidden="true" className="pointer-events-none absolute h-32 w-32 rounded-full border border-white/90 transition-transform duration-500 group-hover:scale-110 sm:h-36 sm:w-36" />
                    {/* Discount Badge */}
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md shadow-red-900/15">
                      -{discount}%
                    </span>

                    {/* Per-product timer chip */}
                    {product.endsInHours && (
                      <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-zinc-900/85 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
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
                    <div className="absolute right-2 top-11 z-20 flex items-center justify-center opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
                          isWishlisted
                            ? "bg-red-500 text-white"
                            : "bg-zinc-900 text-white hover:bg-red-500"
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-700/75">
                    {product.category}
                  </span>

                  {/* Name */}
                  <h3 className="mt-0.5 truncate text-sm font-bold text-zinc-900 transition-colors group-hover:text-emerald-700 sm:text-base">
                    <Link href={`/products/${product.slug}`}>
                    {product.name}
                    </Link>
                  </h3>
                  <span className="mt-0.5 text-[11px] font-medium text-zinc-400">{product.unit}</span>

                  {/* Rating */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Stars rating={product.rating} />
                    <span className="text-[11px] text-zinc-400 font-medium">
                      ({product.rating}.0)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-extrabold tracking-tight text-emerald-700 sm:text-lg">
                      Tk {product.price}
                    </span>
                    <span className="text-xs font-medium text-zinc-400 line-through">
                      Tk {product.oldPrice}
                    </span>
                    <span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-800">
                      Save Tk {product.oldPrice - product.price}
                    </span>
                  </div>

                  {/* Sold progress bar */}
                  <div className="mt-3 rounded-xl bg-zinc-50 px-3 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-zinc-500">
                      <span>
                        Sold <span className="text-red-500">{product.sold}</span> /{" "}
                        {product.total}
                      </span>
                      <span>{Math.round(soldPercent)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70">
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
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-bold shadow-sm transition-all ${
                        isAdded
                          ? "bg-zinc-900 text-white"
                          : "bg-emerald-700 text-white hover:bg-emerald-800"
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
