"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Eye,
  Clock,
  Share2,
  ChevronDown,
  X,
  Star,
  Check,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Search,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Product, PRODUCTS, getRelatedProducts } from "@/data/productsData";
import { useCartStore } from "@/store/cartStore";
import { formatTaka } from "@/lib/currency";
import { useWishlistStore } from "@/store/wishlistStore";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export default function ProductDetail({ product }: { product: Product }) {
  // Gallery images: use product.gallery if available, else [image, hoverImage]
  const galleryImages: string[] =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : ([product.image, product.hoverImage].filter(Boolean) as string[]);

  const [activeImage, setActiveImage] = useState<string>(
    galleryImages[0] || product.image,
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || "1 kg",
  );
  const [selectedRichIn, setSelectedRichIn] = useState<string>(
    product.richIn?.[0] || "Vitamin C",
  );
  const [selectedContainer, setSelectedContainer] = useState<string>("Bundle");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "shipping" | "reviews">(
    "desc",
  );
  const [showStickyBar, setShowStickyBar] = useState<boolean>(true);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState<boolean>(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] =
    useState<boolean>(false);

  // Quick view modal for "You may also like"
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewEmail, setNewReviewEmail] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);

  const isWishlisted = wishlistItems.some((item) => item.id === product.slug);
  const relatedProducts = getRelatedProducts(product.slug, 4);

  // Keep active image in sync when product changes
  useEffect(() => {
    const images =
      product.gallery && product.gallery.length > 0
        ? product.gallery
        : ([product.image, product.hoverImage].filter(Boolean) as string[]);
    setActiveImage(images[0] || product.image);
    setSelectedSize(product.sizes?.[0] || "1 kg");
    setSelectedRichIn(product.richIn?.[0] || "Vitamin C");
    setQuantity(1);
  }, [product]);

  // Manage recently viewed products in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("groca-recently-viewed");
        const list: string[] = stored ? JSON.parse(stored) : [];
        const prods = list
          .map((slug) => PRODUCTS.find((p) => p.slug === slug))
          .filter((p): p is Product => p !== undefined && p !== null)
          .filter((p) => p.slug !== product.slug);
        setRecentlyViewed(prods.slice(0, 6));

        // Save current product to recently viewed
        const updatedSlugs = [
          product.slug,
          ...list.filter((s) => s !== product.slug),
        ].slice(0, 10);
        localStorage.setItem(
          "groca-recently-viewed",
          JSON.stringify(updatedSlugs),
        );
      } catch (e) {
        // Safe localStorage fallback
      }
    }
  }, [product.slug]);

  const handleAddToCart = () => {
    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      unit: selectedSize,
      currency: "BDT",
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleToggleWishlist = () => {
    toggleWishlistItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: selectedSize,
      currency: "BDT",
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: Date.now().toString(),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: newReviewTitle.trim() || "Great quality organic produce!",
      comment: newReviewComment.trim(),
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setNewReviewAuthor("");
    setNewReviewEmail("");
    setNewReviewTitle("");
    setNewReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsWriteReviewOpen(false);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-white relative">
      {/* Breadcrumb Navigation inside Main instead of bulky green header */}

      {/* Floating Recently Viewed Pill on the Right Side (Matches Screenshot 1 & 2) */}
      <button
        type="button"
        onClick={() => setIsRecentlyViewedOpen(!isRecentlyViewedOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-[#74B83E] hover:bg-[#639f33] text-white text-xs font-semibold px-3 py-2 rounded-l-md shadow-lg flex items-center gap-1.5 cursor-pointer transition-all hover:pr-4"
        title="Recently Viewed"
      >
        <span>Recently Viewed</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isRecentlyViewedOpen ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>

      {/* Recently Viewed Slide-over Panel */}
      {isRecentlyViewedOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setIsRecentlyViewedOpen(false)}
          />
          <aside
            aria-label="Recently viewed products"
            className="fixed inset-y-0 right-0 max-w-full flex pl-10"
          >
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-[#74B83E] text-white">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Recently Viewed</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRecentlyViewedOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {recentlyViewed.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    <p>No other recently viewed products yet.</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Browse our store to discover fresh items!
                    </p>
                  </div>
                ) : (
                  recentlyViewed.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      onClick={() => setIsRecentlyViewedOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-100 hover:border-[#74B83E] hover:bg-zinc-50 transition-all group"
                    >
                      <div className="relative w-14 h-14 bg-white rounded-lg border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#74B83E] truncate transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-zinc-500">{item.type}</p>
                        <p className="text-xs font-extrabold text-[#74B83E] mt-0.5">
                          {formatTaka(item.price)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-[#74B83E] transition-colors" />
                    </Link>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-zinc-100 bg-zinc-50">
                <Link
                  href="/shop"
                  onClick={() => setIsRecentlyViewedOpen(false)}
                  className="block w-full py-2.5 text-center text-xs font-bold text-white bg-[#74B83E] hover:bg-[#639f33] rounded-lg shadow-xs transition-colors"
                >
                  Browse Full Catalog
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =========================================
          2. MAIN PRODUCT OVERVIEW SECTION
         ========================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Sleek Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-medium mb-6 sm:mb-8"
        >
          <Link href="/" className="hover:text-[#74B83E] transition-colors">
            Home
          </Link>
          <span className="text-zinc-300">/</span>
          <Link href="/shop" className="hover:text-[#74B83E] transition-colors">
            Shop
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="capitalize text-zinc-900 font-semibold">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* LEFT: Product Gallery with Vertical Thumbnails Beside It (Matches Screenshot 1) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4">
            {/* Main Image Box */}
            <div className="relative w-full aspect-square max-w-[420px] bg-white rounded-2xl flex items-center justify-center p-4 border border-zinc-100/80 shadow-2xs">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-contain p-4 transition-all duration-300"
              />
            </div>

            {/* Vertical Thumbnails Column (Screenshot 1: 4 small vertical thumbnails on the right of the main image) */}
            <div className="flex sm:flex-col flex-row items-center gap-2.5 sm:gap-3 shrink-0">
              {galleryImages.map((img, idx) => {
                const isActive = activeImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    onMouseEnter={() => setActiveImage(img)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white p-1 border transition-all cursor-pointer ${
                      isActive
                        ? "border-[#74B83E] ring-2 ring-[#74B83E]/30 shadow-xs"
                        : "border-zinc-200 hover:border-[#74B83E]/60 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Product Information & Buying Options (Screenshot 1 & 2) */}
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              {product.name}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#74B83E]">
                {formatTaka(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-zinc-400 line-through">
                  {formatTaka(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Specs Table (Aligned labels matching Screenshot 1) */}
            <div className="space-y-3.5 pt-2 text-xs sm:text-sm">
              {/* Vendor */}
              <div className="flex items-center gap-6">
                <span className="w-20 font-bold text-zinc-900 shrink-0">
                  Vendor
                </span>
                <span className="text-zinc-600">{product.vendor}</span>
              </div>

              {/* Type */}
              <div className="flex items-center gap-6">
                <span className="w-20 font-bold text-zinc-900 shrink-0">
                  Type
                </span>
                <span className="text-zinc-600">{product.type}</span>
              </div>

              {/* Size Buttons (Active has green border & text) */}
              <div className="flex items-center gap-6">
                <span className="w-20 font-bold text-zinc-900 shrink-0">
                  Size
                </span>
                <div className="flex items-center flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-[#74B83E] text-[#74B83E] bg-[#74B83E]/5"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rich In Pills (Active has light green bg and green text) */}
              <div className="flex items-center gap-6">
                <span className="w-20 font-bold text-zinc-900 shrink-0">
                  Rich In
                </span>
                <div className="flex items-center flex-wrap gap-2">
                  {product.richIn.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedRichIn(item)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                        selectedRichIn === item
                          ? "text-[#74B83E] bg-[#ecf7e6] border border-[#74B83E]/30"
                          : "text-zinc-600 hover:text-zinc-900 bg-zinc-50 border border-transparent"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Add To Cart & Add To Wishlist (Screenshot 2) */}
            <div className="pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 px-5 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addedToCart ? "Added!" : "Add To Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`w-full py-3 px-5 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isWishlisted
                      ? "bg-rose-50 border border-rose-300 text-rose-600"
                      : "bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  <span>
                    {isWishlisted ? "In Wishlist" : "Add To Wishlist"}
                  </span>
                </button>
              </div>

              {/* Buy It Now Full-Width Button (Screenshot 2) */}
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="w-full py-3 px-5 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                Buy it now
              </Link>
            </div>

            {/* Shopping & Live Analytics Information (Screenshot 2) */}
            <div className="pt-4 space-y-2.5 text-xs text-zinc-600 border-t border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#74B83E]" />
                <span>Estimated deliver 5-7 days</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-[#74B83E]" />
                <span>{product.viewCount} People are viewing this right now</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#74B83E]" />
                <span>24 Hours</span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74B83E] hover:underline cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="text-xs font-bold text-zinc-900 underline hover:text-[#74B83E] transition-colors"
                >
                  Let us know abour your query!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================
          3. TABS SECTION (Screenshot 2 & 3)
         ========================================= */}
      <section
        aria-label="Product Information Tabs"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-zinc-100"
      >
        {/* Tab Buttons (Description in Orange when active, others in Green) */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={`px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "desc"
                ? "bg-[#F97316] text-white shadow-xs"
                : "bg-[#74B83E] text-white hover:bg-[#639f33]"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "shipping"
                ? "bg-[#F97316] text-white shadow-xs"
                : "bg-[#74B83E] text-white hover:bg-[#639f33]"
            }`}
          >
            Shipping &amp; Returns
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "bg-[#F97316] text-white shadow-xs"
                : "bg-[#74B83E] text-white hover:bg-[#639f33]"
            }`}
          >
            Reviews ({reviewsList.length + product.reviewCount})
          </button>
        </div>

        {/* Tab Body Content (Matches Screenshot 2 & 3 exact copy) */}
        <div className="space-y-6 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
          {activeTab === "desc" && (
            <>
              <p>
                People start migrating from conventional to organic products
                because of their health benefits. Comparing chemically treated
                food versus organic food reveals that the latter is more
                nutrient-dense. The distinction between natural and organic
                food is well discernible. A path of goodness extends from
                healthy soil to healthy humans in the end.
              </p>

              <div>
                <h3 className="font-bold text-zinc-900 mb-1.5 text-sm sm:text-base">
                  Overview :
                </h3>
                <p>{product.overview}</p>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 mb-1.5 text-sm sm:text-base">
                  Health Benefits :
                </h3>
                <p>{product.healthBenefits}</p>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 mb-1.5 text-sm sm:text-base">
                  Environment :
                </h3>
                <p>{product.environment}</p>
              </div>
            </>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-900 mb-1 text-sm sm:text-base">
                  Shipping Policy
                </h3>
                <p>
                  We deliver fresh organic products right to your doorstep within
                  2 to 4 hours in metropolitan areas, and within 24 hours nationwide.
                  Packaged in temperature-controlled insulated containers to
                  preserve organic freshness.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 mb-1 text-sm sm:text-base">
                  Returns &amp; Refund Guarantee
                </h3>
                <p>
                  100% money-back guarantee. If you are not satisfied with the
                  freshness or quality upon delivery, contact support immediately
                  for a zero-questions-asked refund or replacement.
                </p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <p className="text-zinc-700 font-medium">
                Rated {product.rating}.0 out of 5 stars based on {product.reviewCount} customer reviews.
              </p>
              {reviewsList.length > 0 && (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-zinc-100 bg-zinc-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-zinc-900">{rev.author}</span>
                        <span className="text-xs text-zinc-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-zinc-800">
                        {rev.title}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          4. CUSTOMER REVIEWS SECTION (Screenshot 3)
         ========================================= */}
      <section
        aria-label="Customer Reviews Section"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center border-t border-zinc-100"
      >
        <h2 className="text-2xl sm:text-3xl font-bold italic text-zinc-900 mb-3 font-lemonada">
          Customer Reviews
        </h2>

        {/* 5 Stars */}
        <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        <p className="text-xs sm:text-sm text-zinc-500 mb-5">
          Be the first to write a review
        </p>

        {/* Write a review Button (Orange #F97316 matching Screenshot 3) */}
        <button
          type="button"
          onClick={() => setIsWriteReviewOpen(!isWriteReviewOpen)}
          className="px-6 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#ea580c] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          {isWriteReviewOpen ? "Close Form" : "Write a review"}
        </button>

        {/* Expandable Review Form */}
        {isWriteReviewOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 max-w-lg mx-auto bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-left space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="font-bold text-sm text-zinc-900">Write a Review</h3>

            {/* Rating Stars Picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 block">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newReviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                placeholder="Your Name *"
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#74B83E]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={newReviewEmail}
                onChange={(e) => setNewReviewEmail(e.target.value)}
                placeholder="Your Email *"
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#74B83E]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Review Title
              </label>
              <input
                type="text"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="Give your review a title"
                className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#74B83E]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Body of Review *
              </label>
              <textarea
                required
                rows={4}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Write your comments here *"
                className="w-full p-3 rounded-lg border border-zinc-200 text-xs sm:text-sm bg-white resize-none focus:outline-none focus:border-[#74B83E]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Review
              </button>
              {reviewSubmitted && (
                <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Review submitted!
                </span>
              )}
            </div>
          </form>
        )}
      </section>

      {/* =========================================
          5. "YOU MAY ALSO LIKE" SECTION (Screenshot 3)
         ========================================= */}
      <section
        aria-label="Related Products"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-100"
      >
        <h2 className="text-2xl sm:text-3xl font-bold italic text-zinc-900 mb-8 font-lemonada text-center sm:text-left">
          You may also like
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((rel) => {
            const isRelWishlisted = wishlistItems.some((w) => w.id === rel.slug);
            return (
              <div
                key={rel.slug}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-zinc-200/80 p-3 sm:p-4 shadow-2xs hover:shadow-xl hover:border-[#74B83E] transition-all duration-300"
              >
                {/* Badge */}
                {rel.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-xs">
                      {rel.badge}
                    </span>
                  </div>
                )}

                {/* Product Image & Hover Action Overlay */}
                <div className="relative w-full aspect-square rounded-xl bg-white flex items-center justify-center p-2 mb-3 overflow-hidden">
                  <Image
                    src={rel.image}
                    alt={rel.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                    className="object-contain p-2 group-hover:scale-108 transition-all duration-500 ease-out"
                  />

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(rel)}
                      className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-[#74B83E] text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                      title="Quick View"
                    >
                      <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlistItem({
                          id: rel.slug,
                          name: rel.name,
                          price: rel.price,
                          image: rel.image,
                          currency: "BDT",
                        });
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 cursor-pointer ${
                        isRelWishlisted
                          ? "bg-red-500 text-white"
                          : "bg-zinc-900/90 hover:bg-red-500 text-white"
                      }`}
                      title={isRelWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 stroke-[2.5] ${
                          isRelWishlisted ? "fill-white" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1 text-center">
                  <Link href={`/products/${rel.slug}`} className="block">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-[#74B83E] transition-colors truncate">
                      {rel.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-0.5">
                    <span className="text-sm sm:text-base font-extrabold text-[#74B83E]">
                      {formatTaka(rel.price)}
                    </span>
                  </div>

                  {/* Add To Cart Pill */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: rel.slug,
                          name: rel.name,
                          price: rel.price,
                          image: rel.image,
                          quantity: 1,
                          currency: "BDT",
                        })
                      }
                      className="w-full py-2 px-3 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          6. FLOATING STICKY BOTTOM BAR (Screenshot 2 & 3)
         ========================================= */}
      {showStickyBar && (
        <aside
          aria-label="Quick add sticky bar"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200/90 shadow-2xl py-2.5 px-4 sm:px-8 animate-in slide-in-from-bottom-2 duration-300"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-6">
            {/* Left: Thumbnail & Quantity Stepper */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-zinc-200 shrink-0">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain p-0.5"
                />
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 font-bold text-zinc-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Middle: Dropdown Selects (Size, Rich In, Container Type - Screenshot 2 & 3) */}
            <div className="hidden md:flex items-center gap-3 text-xs">
              {/* Size Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-medium">Size:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-semibold text-zinc-800 outline-none focus:border-[#74B83E] cursor-pointer"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rich In Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-medium">Rich In:</span>
                <select
                  value={selectedRichIn}
                  onChange={(e) => setSelectedRichIn(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-semibold text-zinc-800 outline-none focus:border-[#74B83E] cursor-pointer"
                >
                  {product.richIn.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Container Type Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-medium">
                  Container Type:
                </span>
                <select
                  value={selectedContainer}
                  onChange={(e) => setSelectedContainer(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-semibold text-zinc-800 outline-none focus:border-[#74B83E] cursor-pointer"
                >
                  <option value="Bundle">Bundle</option>
                  <option value="Single Pack">Single Pack</option>
                  <option value="Family Box">Family Box</option>
                </select>
              </div>
            </div>

            {/* Right: Add To Cart Button & Dismiss X */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="px-6 py-2 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{addedToCart ? "Added!" : "Add To Cart"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowStickyBar(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="Dismiss quick bar"
              >
                <X className="w-4 h-4 text-[#74B83E]" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Quick View Modal for Related Products */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 border border-zinc-100">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-40 h-40 bg-zinc-50 rounded-2xl p-2 shrink-0">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 space-y-2 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#74B83E] bg-[#74B83E]/10 px-2.5 py-0.5 rounded-full inline-block">
                  {quickViewProduct.type}
                </span>
                <h3 className="text-lg font-bold text-zinc-900">
                  {quickViewProduct.name}
                </h3>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl font-extrabold text-[#74B83E]">
                  {formatTaka(quickViewProduct.price)}
                </p>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: quickViewProduct.slug,
                        name: quickViewProduct.name,
                        price: quickViewProduct.price,
                        image: quickViewProduct.image,
                        quantity: 1,
                        currency: "BDT",
                      });
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2 rounded-full bg-[#74B83E] hover:bg-[#639f33] text-white text-xs font-bold transition-all text-center"
                  >
                    Add To Cart
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="py-2 px-3.5 rounded-full border border-zinc-200 text-zinc-700 hover:border-[#74B83E] hover:text-[#74B83E] text-xs font-bold transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
