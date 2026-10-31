"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, Heart, Check, Leaf, X, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface Product {
  id: string;
  name: string;
  image: string;
  hoverImage?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  category: string;
}

const CATEGORIES = [
  {
    id: "milk",
    name: "Milk",
    icon: "/products/icon-milk.png",
    bgClass: "bg-[#e8f7ea]",
    borderClass: "border-emerald-200",
  },
  {
    id: "fruits",
    name: "Fruits",
    icon: "/products/icon-fruits.png",
    bgClass: "bg-[#fdeeed]",
    borderClass: "border-rose-200",
  },
  {
    id: "flour",
    name: "Flour",
    icon: "/products/icon-flour.png",
    bgClass: "bg-[#e8f3fc]",
    borderClass: "border-sky-200",
  },
  {
    id: "meat",
    name: "Meat",
    icon: "/products/icon-meat.png",
    bgClass: "bg-[#fff6dc]",
    borderClass: "border-amber-200",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    icon: "/products/icon-vegetables.png",
    bgClass: "bg-[#fbebf6]",
    borderClass: "border-pink-200",
  },
  {
    id: "eggs",
    name: "Eggs",
    icon: "/products/icon-eggs.png",
    bgClass: "bg-[#74B83E]",
    borderClass: "border-[#74B83E]",
  },
];

const PRODUCTS: Product[] = [
  {
    id: "prod-tomato",
    name: "Tomato",
    image: "/products/prod-tomato.webp",
    hoverImage: "/products/prod-tomato-hover.jpg",
    price: 60,
    oldPrice: 85,
    rating: 5,
    badge: "Save 30%",
    category: "vegetables",
  },
  {
    id: "prod-coriander",
    name: "Coriander",
    image: "/products/prod-coriander.png",
    hoverImage: "/products/prod-coriander-hover.jpg",
    price: 30,
    oldPrice: 45,
    rating: 5,
    badge: "Save 33%",
    category: "vegetables",
  },
  {
    id: "prod-beetroot",
    name: "Beetroot",
    image: "/products/prod-beetroot.webp",
    hoverImage: "/products/prod-beetroot-hover.jpg",
    price: 90,
    oldPrice: 120,
    rating: 5,
    category: "vegetables",
  },
  {
    id: "prod-cucumber",
    name: "Cucumber",
    image: "/products/prod-cucumber.webp",
    hoverImage: "/products/prod-cucumber-hover.webp",
    price: 55,
    oldPrice: 75,
    rating: 5,
    category: "vegetables",
  },
  {
    id: "prod-broccoli",
    name: "Broccoli",
    image: "/products/prod-broccoli.png",
    hoverImage: "/products/prod-broccoli-hover.webp",
    price: 85,
    oldPrice: 110,
    rating: 5,
    category: "vegetables",
  },
  {
    id: "prod-jamun",
    name: "Jamun Fruit",
    image: "/products/prod-jamun.webp",
    hoverImage: "/products/prod-jamun-hover.webp",
    price: 220,
    oldPrice: 280,
    rating: 5,
    category: "fruits",
  },
];

export default function OurProducts() {
  const [activeCategory, setActiveCategory] = useState<string>("eggs");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = PRODUCTS.find((item) => item.id === id);
    if (product) {
      toggleWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        unit: "1 kg",
        currency: "BDT",
      });
    }
  };

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = PRODUCTS.find((item) => item.id === id);
    if (product) addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, currency: "BDT", unit: "1 kg" });
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1800);
  };

  return (
    <section className="w-full py-10 sm:py-14">
      {/* =========================================
          1. SECTION HEADER (Playful organic style with leaf)
         ========================================= */}
      <div className="relative mb-10 sm:mb-12">
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Decorative Leaf Graphic Watermark */}
          <div className="inline-flex items-center justify-center relative mb-1">
            <Leaf className="w-6 h-6 text-[#74B83E]/40 absolute -top-2 -right-4 rotate-12" />
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#74B83E] tracking-tight font-sans drop-shadow-2xs">
              Our Products
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-2 leading-relaxed max-w-lg mx-auto">
            Mauris vitae ultricies leo integer malesuada nunc vel in arcu cursus
          </p>
        </div>

        {/* Top-Right Corner View All Button */}
        <div className="mt-4 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-center sm:justify-end">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#74B83E] hover:bg-[#639f33] active:scale-95 transition-all duration-200 shadow-xs hover:shadow-md group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* =========================================
          2. WATERCOLOR CATEGORY BLOB FILTER
         ========================================= */}
      <div className="w-full max-w-6xl mx-auto mb-12 sm:mb-14 px-2">
        <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7 lg:gap-8 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200 active:scale-95"
              >
                {/* Watercolor Brush Circle Blob */}
                <div
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[132px] lg:h-[132px] flex flex-col items-center justify-center rounded-full transition-all duration-300 shadow-xs group-hover:scale-105 ${
                    isActive
                      ? "bg-[#74B83E] text-white shadow-lg shadow-[#74B83E]/25 scale-105"
                      : `${cat.bgClass} text-zinc-800 hover:shadow-md`
                  }`}
                  style={{
                    borderRadius: "48% 52% 56% 44% / 46% 54% 46% 54%",
                  }}
                >
                  {/* Line Art Icon */}
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 mb-1 sm:mb-1.5">
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      className={`object-contain transition-all ${
                        isActive ? "brightness-0 invert" : ""
                      }`}
                    />
                  </div>

                  {/* Category Label inside blob */}
                  <span
                    className={`text-xs sm:text-sm md:text-[15px] font-bold tracking-tight transition-colors ${
                      isActive ? "text-white" : "text-zinc-800"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================
          3. PRODUCTS GRID (6 items matching screenshot)
         ========================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {PRODUCTS.map((product) => {
            const isWishlisted = wishlistItems.some(
              (item) => item.id === product.id,
            );
            const isAdded = !!addedItems[product.id];

            return (
              <div
                key={product.id}
                className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-2xs"
              >
                {/* Discount Badge ("Save 99%") */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  {product.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Image Box with Hover Swap & Overlay Buttons */}
                <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                  {/* Primary Image */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className={`object-contain p-2 transition-all duration-500 ease-out ${
                      product.hoverImage
                        ? "group-hover:opacity-0 group-hover:scale-95"
                        : "group-hover:scale-108"
                    }`}
                  />

                  {/* Secondary/Alternate Hover Image */}
                  {product.hoverImage && (
                    <Image
                      src={product.hoverImage}
                      alt={`${product.name} alternate view`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                  )}

                  {/* Hover Quick Action Buttons (Search/Zoom & Wishlist) */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setQuickViewProduct(product);
                        setModalImage(product.image);
                      }}
                      className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-[#74B83E] text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                      title="Quick View"
                    >
                      <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
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
                  {/* Name */}
                  <h3 className="font-bold text-sm sm:text-[15px] text-zinc-900 hover:text-[#74B83E] transition-colors truncate">
                    {product.name}
                  </h3>

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
                      onClick={(e) => handleAddToCart(product.id, e)}
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
          4. QUICK VIEW MODAL
         ========================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-100">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative w-44 h-44 bg-zinc-50 rounded-2xl flex items-center justify-center p-3 overflow-hidden">
                  <Image
                    src={modalImage || quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    className="object-contain p-2 transition-all duration-300"
                  />
                </div>
                {quickViewProduct.hoverImage && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalImage(quickViewProduct.image)}
                      className={`relative w-10 h-10 rounded-lg border-2 p-1 bg-zinc-50 transition-all cursor-pointer ${
                        (modalImage || quickViewProduct.image) === quickViewProduct.image
                          ? "border-[#74B83E] shadow-xs"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                      title="View 1"
                    >
                      <Image
                        src={quickViewProduct.image}
                        alt="view 1"
                        fill
                        className="object-contain p-0.5"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalImage(quickViewProduct.hoverImage!)}
                      className={`relative w-10 h-10 rounded-lg border-2 p-1 bg-zinc-50 transition-all cursor-pointer ${
                        modalImage === quickViewProduct.hoverImage
                          ? "border-[#74B83E] shadow-xs"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                      title="View 2 (Alternate)"
                    >
                      <Image
                        src={quickViewProduct.hoverImage}
                        alt="view 2"
                        fill
                        className="object-contain p-0.5"
                      />
                    </button>
                  </div>
                )}
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
                  Fresh farm-picked organic grocery delivered directly to your doorstep within 2 hours.
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={(e) => {
                      handleAddToCart(quickViewProduct.id, e);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 px-5 rounded-full bg-[#74B83E] hover:bg-[#639f33] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add To Cart</span>
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
