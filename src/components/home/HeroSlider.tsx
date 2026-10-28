"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

interface Slide {
  id: number;
  image: string;
  imagePosition: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  align: "right" | "center" | "left";
  textColor?: "dark" | "light";
  bgColor?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/image/slider-1.webp",
    imagePosition: "object-[20%_center] sm:object-center",
    title: "Farm Fresh Whole Grains",
    subtitle: "Organic pulses & unpolished grains",
    highlight: "Grains & Cereals",
    description:
      "Nutrient-dense, unpolished organic pulses, whole grains, and healthy cereals harvested fresh from trusted sustainable farms.",
    ctaText: "Shop Grains",
    ctaLink: "/category/grains",
    align: "right",
  },
  {
    id: 2,
    image: "/image/slider-2.webp",
    imagePosition: "object-center",
    title: "Daily Fresh Farm Veggies",
    subtitle: "Handpicked morning harvest",
    highlight: "Veggies & Fruits",
    description:
      "Crisp morning harvest bursting with vitamins, picked at peak ripeness with zero synthetic fertilizers or harmful chemicals.",
    ctaText: "Discover Deals",
    ctaLink: "/shop",
    align: "center",
  },
  {
    id: 3,
    image: "/image/slider-3.webp",
    imagePosition: "object-[15%_center] sm:object-center",
    title: "Pure Organic Vegetables",
    subtitle: "Direct from local organic farms",
    highlight: "Garden Vegetables",
    description:
      "Pesticide-free bell peppers, earthy potatoes, heirloom tomatoes, and lush crisp greens handpicked daily for your health.",
    ctaText: "Shop Fresh",
    ctaLink: "/category/vegetables",
    align: "right",
  },
  {
    id: 4,
    image: "/image/slider5.png",
    imagePosition: "object-right sm:object-center",
    title: "Fresh Everyday Groceries",
    subtitle: "Fresh fruits, vegetables & daily pantry essentials",
    highlight: "Daily Essentials",
    description:
      "Get all your weekly essentials, handpicked fresh produce, crisp greens, and organic fruits delivered straight to your door.",
    ctaText: "Shop Essentials",
    ctaLink: "/shop",
    align: "left",
    textColor: "light",
    bgColor: "#017F57",
  },
];


export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-slide effect with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="w-full">
      {/* ===================================================
          HERO BANNER SLIDER (FULL WIDTH EDGE-TO-EDGE)
         =================================================== */}
      <div
        className="relative w-full overflow-hidden bg-zinc-100 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div className="relative w-full min-h-[220px] h-[240px] xs:h-[280px] sm:h-[380px] md:h-[480px] lg:h-[580px] xl:h-[660px]">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={slide.bgColor ? { backgroundColor: slide.bgColor } : undefined}
                aria-hidden={!isActive}
              >
                {/* Background Image (tailored mobile focus point) */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className={`object-cover ${slide.imagePosition} select-none`}
                  sizes="100vw"
                />

                {/* Content Overlay */}
                <div className="relative h-full w-full max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center">
                  <div
                    className={`w-full flex ${
                      slide.align === "center"
                        ? "justify-center text-center"
                        : slide.align === "left"
                        ? "justify-start text-left"
                        : "justify-end text-right sm:text-left"
                    }`}
                  >
                    {/* Normal clean text layout - tailored so image food is clearly visible */}
                    <div
                      className={`w-full ${
                        slide.align === "center"
                          ? "max-w-[70%] sm:max-w-xl mx-auto"
                          : slide.align === "left"
                          ? "max-w-[58%] sm:max-w-xl mr-auto sm:ml-0 text-left"
                          : "max-w-[58%] sm:max-w-xl ml-auto sm:ml-0"
                      } lg:max-w-2xl transition-all duration-700 delay-100 ${
                        isActive
                          ? "translate-y-0 opacity-100 scale-100"
                          : "translate-y-4 sm:translate-y-6 opacity-0 scale-95"
                      }`}
                    >
                      {/* Main Heading */}
                      <h1
                        className={`text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-[44px] font-bold leading-snug sm:leading-[1.22] tracking-tight ${
                          slide.textColor === "light"
                            ? "text-white"
                            : "text-zinc-900"
                        }`}
                      >
                        {slide.title}
                      </h1>

                      {/* Subtitle on mobile / Full description on desktop */}
                      <p
                        className={`mt-2 sm:mt-4 md:mt-5 text-[11px] xs:text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-xl ${
                          slide.textColor === "light"
                            ? "text-emerald-50/90"
                            : "text-zinc-600"
                        }`}
                      >
                        <span className="sm:hidden">{slide.subtitle}</span>
                        <span className="hidden sm:inline">{slide.description}</span>
                      </p>

                      {/* Action Button */}
                      <div
                        className={`mt-3 sm:mt-6 md:mt-7 flex items-center ${
                          slide.align === "center"
                            ? "justify-center"
                            : slide.align === "left"
                            ? "justify-start"
                            : "justify-end sm:justify-start"
                        }`}
                      >
                        <Link
                          href={slide.ctaLink}
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 xs:px-5 sm:px-7 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer group/btn ${
                            slide.textColor === "light"
                              ? "text-zinc-900 bg-white hover:bg-zinc-100 active:scale-95 shadow-md"
                              : "text-white bg-[#74B83E] hover:bg-[#639f33] active:scale-95 shadow-xs"
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Animated Vegetable Basket (Medium size, Top-Bottom Float Animation) */}
        <div className="absolute right-2 xs:right-4 sm:right-8 md:right-14 lg:right-20 xl:right-28 bottom-5 sm:bottom-12 md:bottom-16 lg:bottom-20 z-25 pointer-events-none select-none">
          {/* Basket Image with Up-Down Floating Animation */}
          <div className="relative animate-float-basket">
            <div className="relative w-24 xs:w-28 sm:w-44 md:w-56 lg:w-64 xl:w-72 aspect-[1343/1171] drop-shadow-[0_20px_30px_rgba(0,0,0,0.22)]">
              <Image
                src="/products/fresh-vegetable-basket.png"
                alt="Fresh Vegetable Basket"
                fill
                sizes="(max-width: 640px) 120px, (max-width: 1024px) 240px, 320px"
                className="object-contain"
                priority
              />
            </div>

            {/* Organic Floating Badge */}
            <div className="hidden xs:flex absolute -top-1.5 -left-1.5 sm:-top-3 sm:-left-3 bg-white/95 backdrop-blur-xs border border-emerald-100 shadow-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full items-center gap-1 text-[9px] sm:text-[11px] font-bold text-emerald-800">
              <span className="text-xs">🌱</span>
              <span>100% Fresh</span>
            </div>
          </div>

          {/* Dynamic Ground Shadow that breathes as basket moves up/down */}
          <div className="w-16 xs:w-20 sm:w-28 md:w-36 lg:w-44 h-2.5 sm:h-4 bg-black/25 blur-xs rounded-full mx-auto mt-1 animate-shadow-pulse" />
        </div>

        {/* Navigation Arrow Left (Responsive sizing & placement) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-zinc-800 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-zinc-200/60 cursor-pointer opacity-75 hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.2]" />
        </button>

        {/* Navigation Arrow Right (Responsive sizing & placement) */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-zinc-800 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-zinc-200/60 cursor-pointer opacity-75 hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.2]" />
        </button>

        {/* Dots Pagination */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 bg-black/25 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? "w-6 sm:w-8 bg-[#74B83E] shadow-xs"
                  : "w-2 sm:w-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
