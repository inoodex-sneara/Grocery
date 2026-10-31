"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const money = (amount: number, currency: "USD" | "BDT") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <main className="flex-1 bg-[#f7f9f4] px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#74b83e]/10 px-3 py-1.5 text-xs font-bold text-[#54892f]">
            <Heart className="h-3.5 w-3.5 fill-current" />
            Your saved favorites
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-[#203b25] sm:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {items.length} {items.length === 1 ? "item" : "items"} saved for
            later
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 rounded-xl bg-zinc-50 sm:h-28 sm:w-28">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-2 font-bold text-zinc-900">
                      {item.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="shrink-0 rounded-full p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {item.unit && (
                    <p className="mt-1 text-xs text-zinc-500">{item.unit}</p>
                  )}
                  <p className="mt-2 font-bold text-[#54892f]">
                    {money(item.price, item.currency)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({
                        ...item,
                        quantity: 1,
                      })
                    }
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#74b83e] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#639f33]"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#74b83e]/10 text-[#74b83e]">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#203b25]">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#74b83e] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#639f33]"
            >
              Explore products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
