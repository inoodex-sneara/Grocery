"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, Heart, Check, Leaf, X, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface Product {
  id: string;
  slug: string;
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
    id: "vegetables",
    name: "Vegetables",
    icon: "/products/icon-vegetables.png",
    bgClass: "bg-[#e8f7ea]",
  },
  {
    id: "fruits",
    name: "Fruits",
    icon: "/products/icon-fruits.png",
    bgClass: "bg-[#fdeeed]",
  },
  {
    id: "flour",
    name: "Grains & Flour",
    icon: "/products/icon-flour.png",
    bgClass: "bg-[#e8f3fc]",
  },
  {
    id: "meat",
    name: "Meat",
    icon: "/products/icon-meat.png",
    bgClass: "bg-[#fff6dc]",
  },
  {
    id: "eggs",
    name: "Eggs",
    icon: "/products/icon-eggs.png",
    bgClass: "bg-[#ecf7e6]",
  },
  {
    id: "milk",
    name: "Milk & Dairy",
    icon: "/products/icon-milk.png",
    bgClass: "bg-[#fbebf6]",
  },
] as const;

const SHOP_CATEGORY_MAP: Record<string, string> = {
  vegetables: "Vegetables",
  fruits: "Fresh Fruits",
  flour: "Grains & Cereals",
  eggs: "Dairy & Eggs",
  milk: "Dairy & Eggs",
};

const PRODUCTS: Product[] = [
  // Vegetables
  {
    id: "prod-tomato",
    slug: "tomato",
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
    slug: "coriander",
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
    slug: "beetroot",
    name: "Beetroot",
    image: "/products/prod-beetroot.webp",
    hoverImage: "/products/prod-beetroot-hover.jpg",
    price: 90,
    oldPrice: 120,
    rating: 5,
    badge: "Save 25%",
    category: "vegetables",
  },
  {
    id: "prod-cucumber",
    slug: "cucumber",
    name: "Cucumber",
    image: "/products/prod-cucumber.webp",
    hoverImage: "/products/prod-cucumber-hover.webp",
    price: 55,
    oldPrice: 75,
    rating: 5,
    badge: "Save 26%",
    category: "vegetables",
  },
  {
    id: "prod-broccoli",
    slug: "broccoli",
    name: "Broccoli",
    image: "/products/prod-broccoli.png",
    hoverImage: "/products/prod-broccoli-hover.webp",
    price: 85,
    oldPrice: 110,
    rating: 5,
    badge: "Save 22%",
    category: "vegetables",
  },
  {
    id: "prod-cauliflower",
    slug: "cucumber",
    name: "Cauliflower",
    image: "/products/65fa976ad61902ef2307cefc_Cauliflower-Fulcopy_1.webp",
    price: 60,
    oldPrice: 80,
    rating: 5,
    badge: "Save 25%",
    category: "vegetables",
  },

  // Fruits
  {
    id: "prod-jamun",
    slug: "jamun",
    name: "Jamun Fruit",
    image: "/products/prod-jamun.webp",
    hoverImage: "/products/prod-jamun-hover.webp",
    price: 220,
    oldPrice: 280,
    rating: 5,
    badge: "Save 21%",
    category: "fruits",
  },
  {
    id: "prod-watermelon",
    slug: "watermelon",
    name: "Watermelon",
    image: "/shop/Shop-1.webp",
    price: 180,
    oldPrice: 220,
    rating: 5,
    badge: "Save 18%",
    category: "fruits",
  },
  {
    id: "prod-oranges",
    slug: "orange",
    name: "Valencia Oranges",
    image: "/shop/Shop-17.webp",
    price: 240,
    oldPrice: 280,
    rating: 5,
    badge: "Save 15%",
    category: "fruits",
  },
  {
    id: "prod-grapes",
    slug: "grapes",
    name: "Red Seedless Grapes",
    image: "/shop/Shop-20_6dc096c7-db88-496b-b3fe-22b28c244a51.webp",
    price: 380,
    oldPrice: 450,
    rating: 5,
    badge: "Save 15%",
    category: "fruits",
  },

  // Grains & Flour
  {
    id: "prod-buckwheat",
    slug: "buckwheat",
    name: "Whole Buckwheat",
    image: "/shop/Shop-26_7b8fa6d5-1a3c-42f9-ae94-02b6fcbb4263.webp",
    price: 195,
    oldPrice: 240,
    rating: 5,
    badge: "Save 19%",
    category: "flour",
  },
  {
    id: "prod-lentils",
    slug: "lentils",
    name: "Natural Brown Lentils",
    image: "/shop/Shop-28.webp",
    price: 140,
    oldPrice: 175,
    rating: 5,
    badge: "Save 20%",
    category: "flour",
  },
  {
    id: "prod-rice-tm",
    slug: "rice",
    name: "Premium TM Rice",
    image: "/products/premium-basmati-rice.webp",
    price: 160,
    oldPrice: 190,
    rating: 5,
    badge: "Save 15%",
    category: "flour",
  },
  {
    id: "prod-almonds-nut",
    slug: "almonds",
    name: "Raw Almonds",
    image: "/products/premium-almonds.webp",
    hoverImage: "/products/premium-almonds-hover.webp",
    price: 450,
    oldPrice: 550,
    rating: 5,
    badge: "Save 18%",
    category: "flour",
  },

  // Meat
  {
    id: "prod-chicken-fresh",
    slug: "chicken",
    name: "Fresh Chicken Breast",
    image: "/products/prod-chicken.webp",
    price: 320,
    oldPrice: 450,
    rating: 5,
    badge: "Save 28%",
    category: "meat",
  },
  {
    id: "prod-meat-fresh",
    slug: "chicken",
    name: "Tender Red Meat",
    image: "/products/prod-meat.webp",
    price: 780,
    oldPrice: 850,
    rating: 5,
    badge: "Save 10%",
    category: "meat",
  },

  // Eggs & Milk
  {
    id: "prod-eggs-farm",
    slug: "eggs",
    name: "Country Brown Eggs",
    image: "/shop/Shop-4.webp",
    price: 145,
    oldPrice: 165,
    rating: 5,
    badge: "Save 12%",
    category: "eggs",
  },
  {
    id: "prod-milk-bottle",
    slug: "milk",
    name: "Farm Pure Fresh Milk",
    image: "/shop/Shop-4.webp",
    price: 95,
    oldPrice: 110,
    rating: 5,
    badge: "Save 14%",
    category: "milk",
  },
];

export default function OurProducts() {
  const [activeCategory, setActiveCategory] = useState<string>("vegetables");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Filter products by selected watercolor category
  const filteredProducts = PRODUCTS.filter((item) => item.category === activeCategory);
  const displayedProducts = filteredProducts.length > 0 ? filteredProducts : PRODUCTS.slice(0, 6);

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: "1 kg",
      currency: "BDT",
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      currency: "BDT",
      unit: "1 kg",
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section className="w-full py-4 sm:py-6">
      {/* =========================================
          1. SECTION HEADER (Organic style with leaf)
         ========================================= */}
      <div className="relative mb-8 sm:mb-12">
        <div className="text-center max-w-2xl mx-auto px-4">
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
      <div className="w-full max-w-6xl mx-auto mb-10 sm:mb-14 px-2">
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
                  className={`relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[130px] lg:h-[130px] flex flex-col items-center justify-center rounded-full transition-all duration-300 shadow-2xs group-hover:scale-105 ${
                    isActive
                      ? "bg-[#74B83E] text-white shadow-lg shadow-[#74B83E]/25 scale-105"
                      : `${cat.bgClass} text-zinc-800 hover:shadow-md`
                  }`}
                  style={{
                    borderRadius: "48% 52% 56% 44% / 46% 54% 46% 54%",
                  }}
                >
                  {/* Line Art Icon */}
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 mb-1 sm:mb-1.5">
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
                    className={`text-[11px] sm:text-xs md:text-sm font-bold tracking-tight transition-colors text-center px-1 ${
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
          3. PRODUCTS GRID (Responsive 2 to 6 columns)
         ========================================= */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {displayedProducts.map((product) => {
            const isWishlisted = wishlistItems.some((item) => item.id === product.id);
            const isAdded = !!addedItems[product.id];

            return (
              <div
                key={product.id}
                className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-2xs"
              >
                {/* Discount Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  {product.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Image Box with Hover Swap & Overlay Buttons */}
                <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
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

                  {product.hoverImage && (
                    <Image
                      src={product.hoverImage}
                      alt={`${product.name} alternate view`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                  )}

                  {/* Hover Quick Action Buttons */}
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
          4. QUICK VIEW MODAL
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
                  Fresh farm-picked organic grocery delivered directly to your doorstep within 2 hours.
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
