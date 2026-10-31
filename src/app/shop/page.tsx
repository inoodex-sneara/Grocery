"use client";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Star,
  Search,
  Heart,
  Check,
  X,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Truck,
  Filter,
  ChevronDown,
} from "lucide-react";

interface ShopProduct {
  id: string;
  name: string;
  category: "Fresh Fruits" | "Vegetables" | "Grains & Cereals" | "Dairy & Eggs";
  price: number;
  oldPrice?: number;
  unit: string;
  image: string;
  rating: number;
  badge?: string;
  inStock?: boolean;
}

const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "shop-1",
    name: "Fresh Whole Watermelon",
    category: "Fresh Fruits",
    price: 180,
    oldPrice: 220,
    unit: "1 pc (approx 2.5kg)",
    image: "/shop/Shop-1.webp",
    rating: 4.9,
    badge: "Seasonal",
    inStock: true,
  },
  {
    id: "shop-2",
    name: "Farm Fresh Vine Tomatoes",
    category: "Vegetables",
    price: 60,
    oldPrice: 85,
    unit: "1 kg",
    image: "/shop/Shop-2.webp",
    rating: 4.8,
    badge: "Organic",
    inStock: true,
  },
  {
    id: "shop-4",
    name: "Farm Fresh Country Brown Eggs",
    category: "Dairy & Eggs",
    price: 145,
    oldPrice: 165,
    unit: "12 pcs (1 Dozen)",
    image: "/shop/Shop-4.webp",
    rating: 5.0,
    badge: "100% Organic",
    inStock: true,
  },
  {
    id: "shop-9",
    name: "Fresh Wild Oyster Mushrooms",
    category: "Vegetables",
    price: 120,
    oldPrice: 150,
    unit: "250g pack",
    image: "/shop/Shop-9.webp",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "shop-17",
    name: "Fresh Juicy Valencia Oranges",
    category: "Fresh Fruits",
    price: 240,
    oldPrice: 280,
    unit: "1 kg",
    image: "/shop/Shop-17.webp",
    rating: 4.9,
    badge: "Fresh Pick",
    inStock: true,
  },
  {
    id: "shop-20",
    name: "Fresh Seedless Red Grapes",
    category: "Fresh Fruits",
    price: 380,
    oldPrice: 450,
    unit: "500g bunch",
    image: "/shop/Shop-20_6dc096c7-db88-496b-b3fe-22b28c244a51.webp",
    rating: 4.8,
    badge: "Sweet",
    inStock: true,
  },
  {
    id: "shop-26",
    name: "Organic Whole Grain Buckwheat",
    category: "Grains & Cereals",
    price: 195,
    oldPrice: 240,
    unit: "1 kg pack",
    image: "/shop/Shop-26_7b8fa6d5-1a3c-42f9-ae94-02b6fcbb4263.webp",
    rating: 4.9,
    inStock: true,
  },
  {
    id: "shop-28",
    name: "Natural Brown Lentils & Horse Gram",
    category: "Grains & Cereals",
    price: 140,
    oldPrice: 175,
    unit: "1 kg pack",
    image: "/shop/Shop-28.webp",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "shop-cauliflower",
    name: "Fresh Farm Cauliflower (Fulcopy)",
    category: "Vegetables",
    price: 60,
    oldPrice: 80,
    unit: "1 pc (800g)",
    image: "/products/65fa976ad61902ef2307cefc_Cauliflower-Fulcopy_1.webp",
    rating: 4.8,
    badge: "Save 25%",
    inStock: true,
  },
  {
    id: "shop-chilli",
    name: "Fresh Kacha Morich (Green Chilli)",
    category: "Vegetables",
    price: 40,
    oldPrice: 60,
    unit: "250g pack",
    image: "/products/668d1a336465c458a3e0fda7_Kacha-Morich-Chilli-Green_1.webp",
    rating: 4.9,
    inStock: true,
  },
];

const CATEGORIES = [
  "All",
  "Fresh Fruits",
  "Vegetables",
  "Grains & Cereals",
  "Dairy & Eggs",
] as const;

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<"all" | "under-100" | "100-250" | "above-250">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    search: false,
    categories: false,
    price: false,
    rating: false,
    availability: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SHOP_PRODUCTS.length };
    SHOP_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Check if any filter is active
  const hasActiveFilters =
    selectedCategory !== "All" ||
    searchQuery !== "" ||
    priceRange !== "all" ||
    minRating > 0 ||
    onlyInStock;

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange("all");
    setMinRating(0);
    setOnlyInStock(false);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = SHOP_PRODUCTS.find((item) => item.id === id);
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

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = SHOP_PRODUCTS.find((item) => item.id === id);
    if (product) addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, currency: "BDT", unit: product.unit });
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 1800);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Price range filter (in Taka ৳)
      if (priceRange === "under-100" && product.price >= 100) return false;
      if (priceRange === "100-250" && (product.price < 100 || product.price > 250)) return false;
      if (priceRange === "above-250" && product.price <= 250) return false;
      // Rating filter
      if (minRating > 0 && product.rating < minRating) return false;
      // In-stock filter
      if (onlyInStock && !product.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, priceRange, minRating, onlyInStock, sortBy]);

  // Sidebar Filter Component Content
  const FilterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#74B83E]" />
          <h2 className="text-base font-extrabold text-zinc-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-[#74B83E] hover:text-[#5fa02f] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("search")}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 cursor-pointer group select-none"
        >
          <span>Search Product</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 ${
              collapsedSections.search ? "-rotate-90" : "rotate-0"
            }`}
          />
        </button>
        {!collapsedSections.search && (
          <div className="relative animate-in fade-in duration-200">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type keyword..."
              className="w-full pl-8 pr-7 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg placeholder-zinc-400 focus:outline-none focus:border-[#74B83E] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <div className="pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 cursor-pointer group select-none"
        >
          <span>Product Categories</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 ${
              collapsedSections.categories ? "-rotate-90" : "rotate-0"
            }`}
          />
        </button>
        {!collapsedSections.categories && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#74B83E] text-white font-bold shadow-xs"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isSelected ? "bg-white/25 text-white" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 cursor-pointer group select-none"
        >
          <span>Price Range</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 ${
              collapsedSections.price ? "-rotate-90" : "rotate-0"
            }`}
          />
        </button>
        {!collapsedSections.price && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {[
              { id: "all", label: "All Prices" },
              { id: "under-100", label: "Under Tk 100" },
              { id: "100-250", label: "Tk 100 - Tk 250" },
              { id: "above-250", label: "Above Tk 250" },
            ].map((item) => {
              const isSelected = priceRange === item.id;
              return (
                <label
                  key={item.id}
                  onClick={() => setPriceRange(item.id as typeof priceRange)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#ecf7e6] text-[#1f5c22] font-bold"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                      isSelected
                        ? "border-2 border-zinc-900 bg-white"
                        : "border border-zinc-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#74B83E]" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={isSelected}
                    onChange={() => setPriceRange(item.id as typeof priceRange)}
                    className="sr-only"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Rating Filter */}
      <div className="pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 cursor-pointer group select-none"
        >
          <span>Customer Rating</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 ${
              collapsedSections.rating ? "-rotate-90" : "rotate-0"
            }`}
          />
        </button>
        {!collapsedSections.rating && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {[
              { rating: 0, label: "All Ratings" },
              { rating: 4.8, label: "4.8 & Above" },
              { rating: 5.0, label: "5.0 Stars only" },
            ].map((item) => {
              const isSelected = minRating === item.rating;
              return (
                <label
                  key={item.rating}
                  onClick={() => setMinRating(item.rating)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#ecf7e6] text-[#1f5c22] font-bold"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                      isSelected
                        ? "border-2 border-zinc-900 bg-white"
                        : "border border-zinc-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#74B83E]" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="minRating"
                    checked={isSelected}
                    onChange={() => setMinRating(item.rating)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-1">
                    <span>{item.label}</span>
                    {item.rating > 0 && <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-0.5" />}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Availability / In-Stock */}
      <div className="pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider mb-3 cursor-pointer group select-none"
        >
          <span>Availability</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 ${
              collapsedSections.availability ? "-rotate-90" : "rotate-0"
            }`}
          />
        </button>
        {!collapsedSections.availability && (
          <div className="animate-in fade-in duration-200">
            <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-[#74B83E] w-3.5 h-3.5 rounded"
              />
              <span className="font-medium">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Trust Badge Card */}
      <div className="p-3.5 rounded-2xl bg-[#eef7e6] border border-emerald-100/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-[#74B83E]" />
          <span>100% Fresh & Organic</span>
        </div>
        <p className="text-[11px] text-emerald-800/80 leading-relaxed">
          Directly sourced from farms, 100% chemical-free fresh grocery delivery.
        </p>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 pt-1">
          <Truck className="w-3.5 h-3.5 text-[#74B83E]" />
          <span>Fast 2-hour home delivery</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-zinc-50/60 min-h-screen py-6 sm:py-8">
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* =========================================
            MAIN TWO-COLUMN LAYOUT: SIDEBAR + CONTENT
           ========================================= */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* =========================================
              1. LEFT SIDEBAR (Desktop)
             ========================================= */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs sticky top-24">
            {FilterContent}
          </aside>

          {/* =========================================
              2. RIGHT MAIN CONTENT AREA
             ========================================= */}
          <main className="flex-1 w-full min-w-0">
            {/* Top Toolbar (Sort, Counter, Mobile Filter Toggle) */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-white border border-zinc-200/80 rounded-2xl shadow-2xs">
              {/* Left: Mobile Filter Button & Active Filter Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile Filter Drawer Trigger */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3.5 py-2 bg-[#74B83E] hover:bg-[#639f33] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-white ml-0.5 animate-pulse" />
                  )}
                </button>

                {/* Counter */}
                <span className="text-xs text-zinc-500 font-medium ml-1">
                  Showing <strong className="text-zinc-900">{filteredProducts.length}</strong> products
                </span>

                {/* Active Category Chip */}
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                    <span>{selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      className="hover:text-emerald-950 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Active Price Chip */}
                {priceRange !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                    <span>
                      {priceRange === "under-100"
                        ? "Under Tk 100"
                        : priceRange === "100-250"
                        ? "Tk 100 - Tk 250"
                        : "Above Tk 250"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPriceRange("all")}
                      className="hover:text-emerald-950 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Active Search Chip */}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs font-bold rounded-full border border-zinc-200">
                    <span>"{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-zinc-950 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Right: Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <label htmlFor="sort-select" className="text-xs text-zinc-500 font-medium">
                  Sort by:
                </label>
                <div className="relative inline-flex items-center">
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    aria-label="Sort products by"
                    className="bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-[#74B83E] cursor-pointer shadow-2xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <SlidersHorizontal className="w-3 h-3 text-zinc-400 absolute right-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200/80 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#74B83E] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No products found</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  We couldn't find anything matching your filter criteria. Try adjusting or resetting your filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 px-6 py-2.5 bg-[#74B83E] text-white rounded-full text-xs font-bold hover:bg-[#639f33] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlistItems.some(
                    (item) => item.id === product.id,
                  );
                  const isAdded = !!addedItems[product.id];

                  return (
                    <div
                      key={product.id}
                      className="group relative bg-white border border-zinc-200/80 hover:border-[#74B83E] rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-2xs"
                    >
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-xs">
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Product Image Box */}
                      <div className="relative w-full aspect-square bg-zinc-50/60 rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-2 group-hover:scale-108 transition-transform duration-300"
                        />

                        {/* Quick Action Overlay Buttons */}
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

                      {/* Info Box */}
                      <div className="text-center space-y-1.5 flex-1 flex flex-col justify-end">
                        <span className="text-[11px] font-semibold text-[#74B83E] tracking-tight">
                          {product.category}
                        </span>

                        <h3 className="font-bold text-sm sm:text-[15px] text-zinc-900 hover:text-[#74B83E] transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-[11px] text-zinc-400 font-medium">
                          {product.unit}
                        </p>

                        {/* Stars */}
                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-amber-400 text-amber-400"
                            />
                          ))}
                          <span className="text-[11px] text-zinc-400 font-semibold ml-1">
                            ({product.rating})
                          </span>
                        </div>

                        {/* Price in Tk */}
                        <div className="flex items-center justify-center gap-1.5 pt-0.5">
                          <span className="text-base sm:text-lg font-extrabold text-[#74B83E]">
                            Tk {product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-zinc-400 line-through font-normal">
                              Tk {product.oldPrice}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
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
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add To Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =========================================
          MOBILE FILTER SLIDE-OVER DRAWER
         ========================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
              <span className="font-extrabold text-sm text-zinc-900">Filter Products</span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {FilterContent}

            <div className="mt-6 pt-4 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#74B83E] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          QUICK VIEW MODAL
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
                  <span className="text-xs text-zinc-500 font-semibold ml-1">
                    ({quickViewProduct.rating})
                  </span>
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
                  Fresh farm-picked organic groceries delivered directly to your doorstep within 2 hours.
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleAddToCart(quickViewProduct.id, e);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 px-5 rounded-full bg-[#74B83E] hover:bg-[#639f33] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
    </div>
  );
}
