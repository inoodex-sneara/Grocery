"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, Heart, Check, X, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface SpiceProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  badgeColor?: string;
  description: string;
  unit: string;
}

const SPICE_ITEMS: SpiceProduct[] = [
  {
    id: "sp-kacha-morich",
    slug: "chilli",
    name: "Fresh Green Chilli (Pack)",
    image: "/products/spice-green-chilli.webp",
    price: 40,
    oldPrice: 60,
    rating: 5,
    badge: "Fresh Pack",
    badgeColor: "#16a34a",
    description: "Crisp, fiery fresh green finger chillies in sealed fresh-lock supermarket packaging. Adds vibrant pungency to curries and stir-fries.",
    unit: "Fresh pack",
  },
  {
    id: "sp-sukna-morich",
    slug: "sukna-morich",
    name: "Catch Dried Red Chilli",
    image: "/products/spice-dry-chilli.webp",
    price: 85,
    oldPrice: 110,
    rating: 5,
    badge: "Whole Spice",
    badgeColor: "#dc2626",
    description: "Authentic whole dried red chillies in aroma-lock pouch packaging with transparent window. Essential for tadka, vorta, and rich meat curries.",
    unit: "100g pack",
  },
  {
    id: "sp-jira-packet",
    slug: "jira-gura-packet",
    name: "Catch Cumin Powder",
    image: "/products/spice-cumin-powder.webp",
    price: 120,
    oldPrice: 140,
    rating: 5,
    badge: "100% Pure",
    badgeColor: "#74B83E",
    description: "100% pure stone-ground fragrant cumin powder in aroma-lock foil pouch packaging for rich taste and authentic aroma.",
    unit: "100g pack",
  },
  {
    id: "sp-morich-packet",
    slug: "morich-gura-packet",
    name: "Catch Red Chilli Powder",
    image: "/products/spice-chilli-powder.webp",
    price: 145,
    oldPrice: 175,
    rating: 5,
    badge: "Hot & Spicy",
    badgeColor: "#dc2626",
    description: "Vibrant red fine chilli powder made from premium handpicked whole chillies, providing perfect color and heat balance.",
    unit: "200g pack",
  },
  {
    id: "sp-holud-packet",
    slug: "holud-gura-packet",
    name: "Catch Turmeric Powder",
    image: "/products/spice-turmeric-powder.webp",
    price: 110,
    oldPrice: 135,
    rating: 5,
    badge: "Natural Glow",
    badgeColor: "#f59e0b",
    description: "Golden aromatic turmeric powder with high curcumin content, offering radiant natural color and proven wellness benefits.",
    unit: "200g pack",
  },
  {
    id: "sp-masala-packet",
    slug: "masala-packet",
    name: "Catch Garam Masala",
    image: "/products/spice-garam-masala.webp",
    price: 160,
    oldPrice: 190,
    rating: 5,
    badge: "Royal Blend",
    badgeColor: "#7c3aed",
    description: "A master blend of 12 royal aromatic whole spices, toasted and finely ground to elevate festive curries and biryanis.",
    unit: "100g pack",
  },
];

export default function SpicesSection() {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<SpiceProduct | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const toggleWishlist = (product: SpiceProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      currency: "BDT",
    });
  };

  const handleAddToCart = (product: SpiceProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.slug,
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
    <section aria-labelledby="spices-section-heading" className="w-full py-4 sm:py-6">
      {/* =========================================
          SECTION HEADER (Left-Aligned)
         ========================================= */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-3 sm:pb-4">
        <div>
          <span className="text-xs sm:text-sm font-extrabold text-[#74B83E] tracking-widest uppercase mb-1 block">
            Pure Spices &amp; Seasonings
          </span>
          <h2
            id="spices-section-heading"
            className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight"
          >
            Spices &amp; Seasonings
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Essential whole chillies and premium aroma-lock ground spice powders ({SPICE_ITEMS.length} items)
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#74B83E] hover:bg-[#ecf7e6] transition-colors self-start sm:self-auto"
        >
          <span>View All Spices</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* =========================================
          PRODUCTS GRID (Full Width, Left-to-Right)
         ========================================= */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {SPICE_ITEMS.map((product) => {
            const isWishlisted = wishlistItems.some((item) => item.id === product.slug);
            const isAdded = !!addedItems[product.id];

            return (
              <div
                key={product.id}
                className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-2xs"
              >
                {/* Discount / Category Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  {product.badge && (
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: product.badgeColor || "#ef4444" }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Image Container */}
                <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain p-2 transition-all duration-500 ease-out group-hover:scale-108"
                  />

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-[#74B83E] text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                      title="Quick View"
                    >
                      <Search className="w-3.5 h-3.5 stroke-[2.5]" />
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

                {/* Product Details */}
                <div className="text-center space-y-1.5 flex-1 flex flex-col justify-end">
                  <Link href={`/products/${product.slug}`} className="block group/link">
                    <h3 className="font-bold text-sm sm:text-[15px] text-zinc-900 group-hover/link:text-[#74B83E] transition-colors line-clamp-2 min-h-[40px] flex items-center justify-center">
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
          QUICK VIEW MODAL
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

              <div className="flex-1 text-left space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-[#74B83E] uppercase tracking-wider block">
                    {quickViewProduct.unit}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900">
                    {quickViewProduct.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500 font-semibold">(5.0 Rating)</span>
                </div>

                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#74B83E]">
                    Tk {quickViewProduct.price}
                  </span>
                  {quickViewProduct.oldPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      Tk {quickViewProduct.oldPrice}
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleAddToCart(quickViewProduct, e);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 px-5 rounded-full bg-[#74B83E] hover:bg-[#639f33] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    className="py-2.5 px-4 rounded-full border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold text-xs transition-colors"
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

