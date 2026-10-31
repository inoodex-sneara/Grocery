"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  ChevronRight,
  Heart,
  Leaf,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { DEAL_PRODUCTS, type DealProduct } from "@/data/dealsData";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

function money(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DealProductDetail({
  product,
}: {
  product: DealProduct;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const discount = Math.round(
    (1 - product.price / product.oldPrice) * 100,
  );
  const soldPercent = Math.min(
    100,
    Math.round((product.sold / product.total) * 100),
  );

  function addToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      currency: "BDT",
      unit: product.unit,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function toggleWishlist() {
    toggleWishlistItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      currency: "BDT",
    });
  }

  const relatedDeals = DEAL_PRODUCTS.filter(
    (deal) => deal.id !== product.id,
  ).slice(0, 4);

  return (
    <main className="flex-1 bg-[#f8faf6] pb-16">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-8 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-400 sm:text-sm"
        >
          <Link href="/" className="transition hover:text-[#54892f]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/deals" className="transition hover:text-[#54892f]">
            Today&apos;s deals
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-zinc-700">{product.name}</span>
        </nav>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
          <section className="min-w-0">
            <div className="relative isolate flex min-h-[330px] items-center justify-center overflow-hidden rounded-[2rem] border border-[#e6eddf] bg-[radial-gradient(ellipse_at_50%_45%,#ffffff_0%,#f1f7e9_65%,#e8f1df_100%)] p-8 shadow-[0_20px_60px_-40px_rgba(32,59,37,0.35)] sm:min-h-[520px] sm:p-12">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#a8d87a]/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-28 -left-16 -z-10 h-72 w-72 rounded-full bg-[#f4d893]/25 blur-3xl"
              />
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg shadow-red-900/10">
                  <Sparkles className="h-3.5 w-3.5" />
                  {discount}% OFF
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3.5 py-2 text-xs font-bold text-[#426b2e] shadow-sm backdrop-blur">
                  <Leaf className="h-3.5 w-3.5" />
                  Fresh pick
                </span>
              </div>

              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-contain p-12 transition-transform duration-500 hover:scale-105 sm:p-16"
              />

            </div>

          </section>

          <section className="relative isolate overflow-hidden rounded-[2rem] border border-[#e4ecd9] bg-white p-5 shadow-[0_24px_70px_-38px_rgba(32,59,37,0.28)] sm:p-8 lg:sticky lg:top-28 lg:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-[#a8d87a]/15 blur-3xl"
            />
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-[#54892f]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to today&apos;s deals
            </Link>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e4efd8] bg-[#f3f8ed] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#54892f]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#74b83e] shadow-[0_0_0_3px_rgba(116,184,62,0.12)]" />
                {product.category}
              </span>
              {product.endsInHours && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50/80 px-3 py-2 text-[11px] font-bold text-amber-700">
                  <Clock3 className="h-3.5 w-3.5" />
                  Deal ends in {product.endsInHours}h
                </span>
              )}
            </div>

            <h1 className="mt-4 text-[1.75rem] font-black leading-[1.12] tracking-[-0.03em] text-[#203b25] sm:text-[2.1rem]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < product.rating
                        ? "fill-current"
                        : "text-zinc-200"
                    }`}
                  />
                ))}
              </span>
              <span className="text-sm font-extrabold text-zinc-700">
                {product.rating}.0
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300" />
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                Customer favorite
              </span>
            </div>

            <p className="mt-5 max-w-xl text-[13px] leading-6 text-zinc-600 sm:text-sm">
              Enjoy {product.name.toLowerCase()} at a special deal price.
              Carefully selected and packed fresh, while today&apos;s offer
              lasts.
            </p>

            <div className="mt-6 rounded-2xl border border-[#e6efd9] bg-[#f7faf3] px-4 py-4 shadow-[0_8px_24px_-18px_rgba(54,93,37,0.5)] sm:px-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[1.75rem] font-black tracking-[-0.04em] text-[#477d2c] sm:text-[2rem]">
                  {money(product.price)}
                </span>
                <span className="text-sm font-medium text-zinc-400 line-through sm:text-base">
                  {money(product.oldPrice)}
                </span>
                <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm shadow-red-900/10">
                  SAVE {discount}%
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-red-100 bg-white px-2.5 py-1 text-[11px] font-bold text-red-600">
                  You save {money(product.oldPrice - product.price)}
                </span>
                <span className="text-[11px] font-medium text-zinc-500">
                  Limited-time deal
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 divide-x divide-zinc-200/80">
              <div className="flex min-w-0 items-center gap-2.5 py-2 pr-3 sm:gap-3 sm:pr-5">
                <PackageCheck className="h-4 w-4 shrink-0 text-[#54892f]" />
                <div className="min-w-0">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-zinc-400">
                    Pack size
                  </p>
                  <p className="mt-1 text-[12px] font-bold leading-4 text-zinc-800 sm:text-[13px]">
                    {product.unit}
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2.5 py-2 pl-3 sm:gap-3 sm:pl-5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#54892f]" />
                <div className="min-w-0">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-zinc-400">
                    Availability
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-bold leading-4 text-[#54892f] sm:text-[13px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#74b83e]" />
                    In stock
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-4">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-zinc-700">
                  Popular today
                </span>
                <span className="font-semibold text-zinc-500">
                  {product.sold} of {product.total} claimed
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Deal stock claimed"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={soldPercent}
                className="mt-2.5 h-2 overflow-hidden rounded-full bg-white shadow-inner"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a7dd6d] to-[#5b9e31] shadow-[0_0_8px_rgba(91,158,49,0.3)] transition-[width]"
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">
                Only {product.total - product.sold} left at this deal price
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2.5">
              <div className="inline-flex h-12 shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-50/70">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-full items-center px-3.5 text-zinc-500 transition hover:text-[#54892f]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-7 text-center text-sm font-bold text-zinc-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-full items-center px-3.5 text-zinc-500 transition hover:text-[#54892f]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                className={`inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-white shadow-sm transition ${
                  added
                    ? "bg-zinc-800"
                    : "bg-gradient-to-r from-[#79bd42] to-[#5c9e32] shadow-md shadow-[#54892f]/20 hover:-translate-y-0.5 hover:from-[#6eaf3b] hover:to-[#4f8d2b] hover:shadow-lg"
                }`}
              >
                {added ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                <span className="truncate">
                  {added ? "Added to cart" : "Add to cart"}
                </span>
              </button>
              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                aria-pressed={isWishlisted}
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-zinc-200 bg-white text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/70 px-4 py-3.5 text-xs leading-5 text-zinc-500">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#74b83e]" />
              <span>
                Freshly packed and delivered to your door. Shipping is
                calculated at checkout.
              </span>
            </div>
          </section>
        </div>

        <section className="mt-14 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#54892f]">
                More fresh finds
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#203b25] sm:text-3xl">
                You may also like
              </h2>
            </div>
            <Link
              href="/deals"
              className="text-sm font-bold text-[#54892f] transition hover:text-[#365d25]"
            >
              View all deals
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {relatedDeals.map((deal) => {
              const dealDiscount = Math.round(
                (1 - deal.price / deal.oldPrice) * 100,
              );

              return (
                <Link
                  key={deal.id}
                  href={`/products/${deal.slug}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#b6d59a] hover:shadow-lg sm:rounded-3xl sm:p-4"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f9f4] sm:rounded-2xl">
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-1 text-[10px] font-extrabold text-white">
                      -{dealDiscount}%
                    </span>
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 22vw"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-4"
                    />
                  </div>
                  <p className="mt-3 truncate text-sm font-bold text-zinc-800 group-hover:text-[#54892f]">
                    {deal.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-extrabold text-[#54892f]">
                      {money(deal.price)}
                    </span>
                    <span className="text-xs text-zinc-400 line-through">
                      {money(deal.oldPrice)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
