"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Eye, Heart, Check, X, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface EssentialProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  description: string;
  unit: string;
}

const ESSENTIAL_ITEMS: EssentialProduct[] = [
  {
    id: "prod-chilli",
    slug: "chilli",
    name: "Green Chilli",
    image: "/products/668d1a336465c458a3e0fda7_Kacha-Morich-Chilli-Green_1.webp",
    price: 40,
    oldPrice: 60,
    rating: 5,
    badge: "Save 33%",
    description:
      "Bright green, fiery hot chillies handpicked for peak crispness. Packed with vitamin C, antioxidants, and fiery natural heat.",
    unit: "250g pack",
  },
  {
    id: "prod-onion",
    slug: "onion",
    name: "Onion",
    image: "/products/prod-onion.webp",
    price: 75,
    oldPrice: 95,
    rating: 5,
    badge: "Save 21%",
    description:
      "Crisp, pungent Deshi red onions harvested fresh daily. Adds essential depth, flavor, and rich aroma to curries, stews, and daily cooking.",
    unit: "1 kg pack",
  },
  {
    id: "prod-garlic",
    slug: "garlic",
    name: "Garlic",
    image: "/products/prod-garlic.webp",
    price: 160,
    oldPrice: 190,
    rating: 5,
    badge: "Save 16%",
    description:
      "Fresh, tight-skinned organic garlic bulbs with pungent aroma and robust medicinal potency. A kitchen powerhouse for seasoning and immunity.",
    unit: "500g pack",
  },
  {
    id: "prod-tomato",
    slug: "tomato",
    name: "Fresh Tomato",
    image: "/products/prod-tomato.webp",
    price: 99,
    oldPrice: 149,
    rating: 4,
    badge: "Save 34%",
    description:
      "Sun-ripened tomatoes bursting with flavor, perfect for sauces, salads, and everyday cooking.",
    unit: "1 kg pack",
  },
  {
    id: "prod-cucumber",
    slug: "cucumber",
    name: "Cucumber",
    image: "/products/prod-cucumber.webp",
    price: 75,
    rating: 4,
    description:
      "Cool, crisp and refreshing cucumbers, perfect for salads, sandwiches, and snacking.",
    unit: "500g pack",
  },
  {
    id: "prod-coriander",
    slug: "coriander",
    name: "Coriander",
    image: "/products/prod-coriander.png",
    price: 49,
    rating: 5,
    description:
      "Fresh, aromatic coriander leaves with rich green color and intense fragrance.",
    unit: "100g pack",
  },
];

export default function KitchenEssentials() {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<EssentialProduct | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const toggleWishlist = (product: EssentialProduct, e: React.MouseEvent) => {
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

  const handleAddToCart = (product: EssentialProduct, e: React.MouseEvent) => {
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
    <section aria-labelledby="new-arrivals-heading" className="w-full py-4 sm:py-6">
      {/* =========================================
          SECTION HEADER (Left Aligned)
         ========================================= */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-3 sm:pb-4">
        <div>
          <span className="text-xs sm:text-sm font-extrabold text-[#74B83E] tracking-widest uppercase mb-1 block">
            New Arrivals
          </span>
          <h2
            id="new-arrivals-heading"
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight"
          >
            Fresh Picks, Just In
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Discover our latest additions ({ESSENTIAL_ITEMS.length} items)
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#74B83E] hover:bg-[#ecf7e6] transition-colors self-start sm:self-auto"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* =========================================
          PRODUCTS GRID (Full Width, Left-to-Right)
         ========================================= */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {ESSENTIAL_ITEMS.map((product) => {
            const isWishlisted = wishlistItems.some((item) => item.id === product.id);
            const isAdded = !!addedItems[product.id];

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.slug}`)}
                className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-2xs cursor-pointer"
              >
                {/* Discount Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  {product.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Image Box with Hover Zoom & Action Overlay */}
                <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-contain p-2 transition-all duration-500 ease-out group-hover:scale-108"
                  />

                  {/* Hover Quick Action Buttons (Search/Zoom & Wishlist) */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-[#74B83E] text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer ${
                        isWishlisted
                          ? "bg-red-500 text-white"
                          : "bg-zinc-900/90 hover:bg-red-500 text-white"
                      }`}
                      title={isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 stroke-[2.5] ${
                          isWishlisted ? "fill-white" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Product Information */}
                <div className="text-center space-y-1.5 flex-1 flex flex-col justify-end">
                  {/* Name linking to product detail page */}
                  <Link href={`/products/${product.slug}`} className="block group/link">
                    <h3 className="font-bold text-sm sm:text-[15px] text-zinc-900 group-hover/link:text-[#74B83E] transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>

                  {/* 5 Golden Stars */}
                  <div className="flex items-center justify-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <span className="text-sm sm:text-base font-extrabold text-[#74B83E]">
                      Tk {product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-zinc-400 line-through font-normal">
                        Tk {product.oldPrice}
                      </span>
                    )}
                  </div>

                  {/* "Add To Cart" Pill Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`w-full py-2 px-4 rounded-full text-xs font-bold transition-all duration-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        isAdded
                          ? "bg-zinc-900 text-white"
                          : "bg-[#74B83E] hover:bg-[#639f33] text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <span>Add To Cart</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================
          QUICK VIEW MODAL (Matching OurProducts)
         ========================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-100">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-44 h-44 bg-zinc-50 rounded-2xl flex items-center justify-center p-3 overflow-hidden shrink-0">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                {quickViewProduct.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600">
                    {quickViewProduct.badge}
                  </span>
                )}
                <Link
                  href={`/products/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="hover:underline"
                >
                  <h3 className="text-xl font-extrabold text-zinc-900 hover:text-[#74B83E] transition-colors">
                    {quickViewProduct.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-zinc-500 font-semibold ml-1">(5.0)</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-2xl font-extrabold text-[#74B83E]">
                    Tk {quickViewProduct.price}
                  </span>
                  {quickViewProduct.oldPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      Tk {quickViewProduct.oldPrice}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={(e) => {
                      handleAddToCart(quickViewProduct, e);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 px-5 rounded-full bg-[#74B83E] hover:bg-[#639f33] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add To Cart</span>
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="py-2.5 px-4 rounded-full border border-zinc-200 text-zinc-700 hover:border-[#74B83E] hover:text-[#74B83E] text-xs font-bold transition-all text-center flex items-center justify-center"
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