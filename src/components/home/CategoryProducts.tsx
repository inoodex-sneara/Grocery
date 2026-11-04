"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, ShoppingCart, Heart, Eye, Check, X } from "lucide-react";
import { PRODUCTS, Product } from "@/data/productsData";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

const CATEGORIES = [
  {
    name: "Vegetables & Fresh Herbs",
    slug: "vegetables",
    badge: "Fresh Garden Picks",
    types: ["Vegetable", "Herb"],
    subtitle: "Farm-picked morning harvest with crisp freshness",
  },
  {
    name: "Grains & Dry Fruits",
    slug: "grains",
    badge: "Pantry Essentials",
    types: ["Grain", "Dry Fruit"],
    subtitle: "Premium grains, pantry staples, and nutrient-rich dry fruits",
  },
  {
    name: "Farm Meat & Poultry",
    slug: "meats",
    badge: "100% Halal Fresh",
    types: ["Meat"],
    subtitle: "100% antibiotic-free, tender fresh cuts daily",
  },
];

// Helper to get consistent Bangladeshi Taka (Tk) pricing
const getDisplayPrice = (product: Product) => {
  const tkMap: Record<string, { price: number; oldPrice?: number; badge?: string }> = {
    beetroot: { price: 90, oldPrice: 120, badge: "Save 25%" },
    broccoli: { price: 85, oldPrice: 110, badge: "Save 23%" },
    tomato: { price: 60, oldPrice: 85, badge: "Save 29%" },
    cucumber: { price: 55, oldPrice: 75, badge: "Save 27%" },
    coriander: { price: 30, oldPrice: 45, badge: "Save 33%" },
    onion: { price: 75, oldPrice: 95, badge: "Save 21%" },
    garlic: { price: 160, oldPrice: 190, badge: "Save 16%" },
    almonds: { price: 280, oldPrice: 350, badge: "Save 20%" },
    rice: { price: 160, oldPrice: 190, badge: "Save 16%" },
    buckwheat: { price: 195, oldPrice: 240, badge: "Save 19%" },
    lentils: { price: 140, oldPrice: 175, badge: "Save 20%" },
    chicken: { price: 320, oldPrice: 450, badge: "Save 29%" },
    "chicken-drumsticks": { price: 380, oldPrice: 460, badge: "Save 17%" },
    "chicken-breast": { price: 420, oldPrice: 500, badge: "Save 16%" },
    meat: { price: 780, oldPrice: 850, badge: "Save 10%" },
    mutton: { price: 1150, oldPrice: 1300, badge: "Save 12%" },
    "farm-eggs": { price: 145, oldPrice: 180, badge: "Save 19%" },
    chilli: { price: 40, oldPrice: 60, badge: "Save 33%" },
  };

  const mapped = tkMap[product.slug.toLowerCase()];
  if (mapped) {
    return {
      price: mapped.price,
      oldPrice: mapped.oldPrice,
      badge: mapped.badge || product.badge,
    };
  }

  return {
    price: Math.round(product.price >= 20 ? product.price : product.price * 80),
    oldPrice: product.originalPrice
      ? Math.round(product.originalPrice >= 20 ? product.originalPrice : product.originalPrice * 80)
      : undefined,
    badge: product.badge,
  };
};

export default function CategoryProducts() {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { price } = getDisplayPrice(product);

    addItem({
      id: product.slug,
      name: product.name,
      price: price,
      image: product.image,
      quantity: 1,
      unit: product.sizes?.[0] || "1 kg",
      currency: "BDT",
    });

    setAddedItems((prev) => ({ ...prev, [product.slug]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.slug]: false }));
    }, 1800);
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { price } = getDisplayPrice(product);

    toggleWishlistItem({
      id: product.slug,
      name: product.name,
      price: price,
      image: product.image,
      unit: product.sizes?.[0] || "1 kg",
      currency: "BDT",
    });
  };

  return (
    <section aria-labelledby="category-products-heading" className="w-full py-4 sm:py-6">
      {/* =========================================
          SECTION HEADER
         ========================================= */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#74B83E] tracking-widest uppercase mb-1 block">
          Find Your Favorites
        </span>
        <h2
          id="category-products-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight"
        >
          Shop by Category
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-2 leading-relaxed">
          Explore fresh organic picks and daily kitchen essentials organized for easy shopping.
        </p>
      </div>

      {/* =========================================
          CATEGORIES LIST (Vegetables, Grains, Meat)
         ========================================= */}
      <div className="space-y-10 sm:space-y-14">
        {CATEGORIES.map((category) => {
          const categoryProducts = PRODUCTS.filter((product) =>
            category.types.includes(product.type),
          );

          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.slug} className="w-full">
              {/* Category Header Row (Styled like New Arrivals header) */}
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-3 sm:pb-4">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#74B83E] tracking-widest uppercase mb-1 block">
                    {category.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-500">
                    {category.subtitle} ({categoryProducts.length}{" "}
                    {categoryProducts.length === 1 ? "item" : "items"})
                  </p>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#74B83E] hover:bg-[#ecf7e6] transition-colors self-start sm:self-auto"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Products Shelf Grid (Exact New Arrivals 6-Col Grid & Card Anatomy) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {categoryProducts.map((product) => {
                  const { price, oldPrice, badge } = getDisplayPrice(product);
                  const isWishlisted = wishlistItems.some((w) => w.id === product.slug);
                  const isAdded = !!addedItems[product.slug];

                  return (
                    <div
                      key={product.slug}
                      onClick={() => router.push(`/products/${product.slug}`)}
                      className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-2xs cursor-pointer"
                    >
                      {/* Discount / Category Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        {badge && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-xs">
                            {badge}
                          </span>
                        )}
                      </div>

                      {/* Product Image Container with Smooth Hover Zoom */}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-[#74B83E] text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                            title="Quick View"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleWishlist(product, e)}
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
                        <Link
                          href={`/products/${product.slug}`}
                          className="block group/link"
                        >
                          <h4 className="font-bold text-sm sm:text-[15px] text-zinc-900 group-hover/link:text-[#74B83E] transition-colors truncate">
                            {product.name}
                          </h4>
                        </Link>

                        {/* 5 Golden Stars (Clean like New Arrivals) */}
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
                            Tk {price}
                          </span>
                          {oldPrice && (
                            <span className="text-xs text-zinc-400 line-through font-normal">
                              Tk {oldPrice}
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
          );
        })}
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

              <div className="flex-1 space-y-3 text-center sm:text-left">
                {getDisplayPrice(quickViewProduct).badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600">
                    {getDisplayPrice(quickViewProduct).badge}
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
                  <span className="text-xs text-zinc-500 font-semibold ml-1">
                    ({quickViewProduct.rating || 5}.0)
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-2xl font-extrabold text-[#74B83E]">
                    Tk {getDisplayPrice(quickViewProduct).price}
                  </span>
                  {getDisplayPrice(quickViewProduct).oldPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      Tk {getDisplayPrice(quickViewProduct).oldPrice}
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
