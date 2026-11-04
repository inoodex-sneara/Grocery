"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, Heart, ShoppingCart, Star, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface GrainProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  unit: string;
  description: string;
}

const GRAIN_ITEMS: GrainProduct[] = [
  {
    id: "premium-rice",
    slug: "rice",
    name: "Premium Basmati Rice",
    image: "/products/premium-basmati-rice.webp",
    price: 310,
    oldPrice: 390,
    rating: 5,
    badge: "Best Seller",
    unit: "5 kg bag",
    description: "Aromatic long grains with fluffy texture and premium freshness for everyday meals.",
  },
  {
    id: "brown-rice",
    slug: "brown-rice",
    name: "Nutritious Brown Rice",
    image: "/products/prod-rice.webp",
    price: 245,
    oldPrice: 300,
    rating: 5,
    badge: "Healthy Choice",
    unit: "2 kg bag",
    description: "High-fiber, naturally wholesome rice packed with nutrients and rich earthy flavor.",
  },
  {
    id: "almonds",
    slug: "almonds",
    name: "Premium Almonds",
    image: "/products/prod-almonds.webp",
    price: 420,
    oldPrice: 520,
    rating: 5,
    badge: "Protein Rich",
    unit: "500 g pack",
    description: "Crunchy, nutrient-dense almonds perfect for snacking, smoothies, and healthy baking.",
  },
  {
    id: "lentils",
    slug: "lentils",
    name: "Natural Lentils",
    image: "/products/prod-rice-fresh.webp",
    price: 190,
    oldPrice: 240,
    rating: 5,
    badge: "High Fiber",
    unit: "1 kg pack",
    description: "Naturally sourced lentils rich in protein, fiber, and daily kitchen essentials.",
  },
];

export default function GrainsFlourSection() {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<GrainProduct | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const toggleWishlist = (product: GrainProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      currency: "BDT",
    });
  };

  const handleAddToCart = (product: GrainProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      unit: product.unit,
      currency: "BDT",
    });

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section aria-labelledby="grains-flour-heading" className="w-full py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-3 sm:pb-4">
        <div>
          <span className="mb-1 block text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#74B83E]">
            Pantry Essentials
          </span>
          <h2
            id="grains-flour-heading"
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight"
          >
            Grains &amp; Flour
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#74B83E] hover:bg-[#ecf7e6] transition-colors self-start sm:self-auto"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {GRAIN_ITEMS.map((product) => {
            const isWishlisted = wishlistItems.some((item) => item.id === product.id);
            const isAdded = !!addedItems[product.id];

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.slug}`)}
                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#74B83E] hover:shadow-xl sm:p-4"
              >
                {product.badge && (
                  <div className="absolute left-2.5 top-2.5 z-10">
                    <span className="inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-2 transition-all duration-500 ease-out group-hover:scale-108"
                  />

                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/90 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#74B83E]"
                      title="Quick View"
                    >
                      <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product, e)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
                        isWishlisted
                          ? "bg-red-500 text-white"
                          : "bg-zinc-900/90 text-white hover:bg-red-500"
                      }`}
                      title={isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`h-3.5 w-3.5 stroke-[2.5] ${isWishlisted ? "fill-white" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-end space-y-1.5 text-center">
                  <Link href={`/products/${product.slug}`} className="block group/link" onClick={(e) => e.stopPropagation()}>
                    <h3 className="truncate text-sm font-bold text-zinc-900 transition-colors group-hover/link:text-[#74B83E] sm:text-[15px]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <span className="text-sm font-extrabold text-[#74B83E] sm:text-base">Tk {product.price}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-zinc-400 line-through">Tk {product.oldPrice}</span>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`w-full rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                        isAdded ? "bg-zinc-900 text-white" : "bg-[#74B83E] text-white hover:bg-[#639f33]"
                      }`}
                    >
                      {isAdded ? (
                        <span className="inline-flex items-center justify-center gap-1.5">
                          <Check className="h-3.5 w-3.5" />
                          Added!
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5">
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add To Cart
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-100 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="relative h-44 w-44 overflow-hidden rounded-2xl bg-zinc-50 p-3">
                <Image src={quickViewProduct.image} alt={quickViewProduct.name} fill className="object-contain p-2" />
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                {quickViewProduct.badge && (
                  <span className="inline-block rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {quickViewProduct.badge}
                  </span>
                )}

                <Link href={`/products/${quickViewProduct.slug}`} onClick={() => setQuickViewProduct(null)} className="hover:underline">
                  <h3 className="text-xl font-extrabold text-zinc-900 hover:text-[#74B83E] transition-colors">
                    {quickViewProduct.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-center gap-1 text-amber-400 sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-zinc-500">(5.0)</span>
                </div>

                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <span className="text-2xl font-extrabold text-[#74B83E]">Tk {quickViewProduct.price}</span>
                  {quickViewProduct.oldPrice && (
                    <span className="text-sm text-zinc-400 line-through">Tk {quickViewProduct.oldPrice}</span>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-zinc-500">{quickViewProduct.description}</p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleAddToCart(quickViewProduct, e);
                      setQuickViewProduct(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#74B83E] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#639f33]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add To Cart
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="flex items-center justify-center rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 transition-colors hover:border-[#74B83E] hover:text-[#74B83E]"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
