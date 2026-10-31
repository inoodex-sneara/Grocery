"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Search, Heart, ShoppingCart, X, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface SpecialProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  soldOut?: boolean;
  category?: string;
}

const SPECIAL_PRODUCTS: SpecialProduct[] = [
  {
    id: "sp-watermelon",
    name: "Watermelon",
    price: 180,
    oldPrice: 220,
    image: "/shop/Shop-1.webp",
    badge: "Save 92%",
    rating: 5,
    category: "Fruits",
  },
  {
    id: "sp-tomato",
    name: "Tomato",
    price: 60,
    oldPrice: 85,
    image: "/shop/Shop-2.webp",
    badge: "Save 99%",
    rating: 5,
    category: "Vegetables",
  },
  {
    id: "sp-coriander",
    name: "Coriander",
    price: 30,
    oldPrice: 45,
    image: "/products/prod-coriander.png",
    badge: "Save 99%",
    rating: 5,
    category: "Vegetables",
  },
  {
    id: "sp-egg",
    name: "Egg",
    price: 145,
    oldPrice: 165,
    image: "/shop/Shop-4.webp",
    badge: "Sold Out",
    soldOut: true,
    rating: 5,
    category: "Dairy & Eggs",
  },
  {
    id: "sp-chicken",
    name: "Chicken Breast",
    price: 320,
    oldPrice: 450,
    image: "/products/prod-chicken.webp",
    badge: "Sold Out",
    soldOut: true,
    rating: 5,
    category: "Meat & Poultry",
  },
  {
    id: "sp-badam",
    name: "Badam",
    price: 280,
    oldPrice: 350,
    image: "/shop/Shop-26_7b8fa6d5-1a3c-42f9-ae94-02b6fcbb4263.webp",
    badge: "Sold Out",
    soldOut: true,
    rating: 5,
    category: "Dry Fruits & Nuts",
  },
  {
    id: "sp-cookies",
    name: "Nuts Cookies",
    price: 120,
    image: "/products/prod-cookies.webp",
    rating: 5,
    category: "Bakery & Snacks",
  },
  {
    id: "sp-rice",
    name: "TM Rice",
    price: 160,
    image: "/products/prod-rice.webp",
    rating: 5,
    category: "Grains & Rice",
  },
  {
    id: "sp-mushroom",
    name: "Flower Mushroom",
    price: 120,
    oldPrice: 150,
    image: "/shop/Shop-9.webp",
    badge: "Save 99%",
    rating: 5,
    category: "Vegetables",
  },
];

export default function SpecialProducts() {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const [quickViewProduct, setQuickViewProduct] = useState<SpecialProduct | null>(null);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = SPECIAL_PRODUCTS.find((item) => item.id === id);
    if (product) {
      toggleWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        unit: "1 pc",
        currency: "BDT",
      });
    }
  };

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = SPECIAL_PRODUCTS.find((item) => item.id === id);
    if (product && !product.soldOut) addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, currency: "BDT", unit: "1 pc" });
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1800);
  };

  return (
    <section className="w-full pt-4 pb-12">
      {/* =========================================
          SECTION HEADER WITH LEAF DECORATION
         ========================================= */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        {/* Decorative Green Leaves Graphic */}
        <div className="flex items-center justify-center mb-2">
          <svg
            className="w-10 h-7 text-[#74B83E]/80"
            viewBox="0 0 40 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Leaf */}
            <path
              d="M18 18C12 18 6 13 4 7C10 5 18 9 18 18Z"
              fill="#74B83E"
              fillOpacity="0.85"
            />
            {/* Center Top Leaf */}
            <path
              d="M20 2C24 8 23 15 20 22C17 15 16 8 20 2Z"
              fill="#8bd450"
              fillOpacity="0.9"
            />
            {/* Right Leaf */}
            <path
              d="M22 18C28 18 34 13 36 7C30 5 22 9 22 18Z"
              fill="#74B83E"
              fillOpacity="0.85"
            />
          </svg>
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-[#74B83E] tracking-tight font-lemonada">
          Special Products
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-normal leading-relaxed">
          Ut tellus elementum sagittis vitae et leo. Sollicitudin tempor id eu nisl nunc
        </p>
      </div>

      {/* =========================================
          3x3 HORIZONTAL PRODUCT CARDS GRID
         ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {SPECIAL_PRODUCTS.map((product) => {
          const isWishlisted = wishlistItems.some(
            (item) => item.id === product.id,
          );
          const isAdded = !!addedItems[product.id];

          return (
            <div
              key={product.id}
              className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden"
              onClick={() => setQuickViewProduct(product)}
            >
              {/* =========================================
                  LEFT: IMAGE & ACTION BUTTONS
                 ========================================= */}
              <div className="relative w-28 sm:w-32 h-28 sm:h-32 shrink-0 bg-zinc-50/70 rounded-xl flex items-center justify-center p-2">
                {/* Red Discount / Sold Out Badge */}
                {product.badge && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-2xs select-none">
                    {product.badge}
                  </span>
                )}

                {/* Product Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Floating Action Buttons (Quick View & Wishlist) */}
                <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  {/* Quick View Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-[#74B83E] transition-all duration-200 shadow-md cursor-pointer hover:scale-110"
                    title="Quick View"
                    aria-label="Quick View"
                  >
                    <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  {/* Wishlist Button */}
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

              {/* =========================================
                  RIGHT: DETAILS (NAME, STARS, PRICE)
                 ========================================= */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Product Name */}
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-[#74B83E] transition-colors truncate">
                  {product.name}
                </h3>

                {/* Star Rating (5 Gold Stars) */}
                <div className="flex items-center gap-0.5 text-amber-400 mt-1 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Price (Green Current Price + Strikethrough Old Price) */}
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-[#74B83E]">
                    Tk {product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs text-zinc-400 line-through font-normal">
                      Tk {product.oldPrice}
                    </span>
                  )}
                </div>

                {/* Status or Add Button on Mobile */}
                <div className="mt-2.5">
                  {product.soldOut ? (
                    <span className="text-[11px] font-bold text-zinc-400">
                      Out of Stock
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? "bg-zinc-900 text-white"
                          : "bg-emerald-50 text-[#74B83E] hover:bg-[#74B83E] hover:text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          QUICK VIEW MODAL FOR SPECIAL PRODUCTS
         ========================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-100">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-44 h-44 bg-zinc-50 rounded-2xl flex items-center justify-center p-3 shrink-0">
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
                <h3 className="text-xl font-extrabold text-zinc-900">
                  {quickViewProduct.name}
                </h3>
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
                <p className="text-xs text-zinc-500">
                  Fresh organic product sourced daily from partner farms, 100% natural and preservative-free.
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    disabled={quickViewProduct.soldOut}
                    onClick={(e) => {
                      if (quickViewProduct.soldOut) return;
                      handleAddToCart(quickViewProduct.id, e);
                      setQuickViewProduct(null);
                    }}
                    className={`flex-1 py-2.5 px-5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      quickViewProduct.soldOut
                        ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                        : "bg-[#74B83E] hover:bg-[#639f33] text-white cursor-pointer"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{quickViewProduct.soldOut ? "Sold Out" : "Add To Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
