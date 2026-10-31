"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";

/* Custom SVG for X (formerly Twitter) */
function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* Custom SVG for Facebook */
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* Custom SVG for Pinterest */
function PinterestIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

/* Custom SVG for Instagram */
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden text-white">
      {/* =========================================
          BACKGROUND IMAGE & DARK OVERLAYS
         ========================================= */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/image/footer-bg.webp"
          alt="Fresh Groceries in Baskets"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* Dark Vignette Overlay for maximum contrast and authentic ambient depth */}
        <div className="absolute inset-0 bg-[#0d1209]/85 sm:bg-[#0b0f08]/82" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/85" />
      </div>

      {/* =========================================
          MAIN FOOTER CONTAINER
         ========================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-14 sm:pt-16 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12">
          {/* =========================================
              COLUMN 1: BRAND LOGO, ADDRESS & SOCIALS
             ========================================= */}
          <div className="space-y-4">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group select-none"
            >
              <div className="flex items-center gap-2.5">
                {/* Vector Cart with Fresh Produce */}
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 drop-shadow-sm transition-transform group-hover:scale-105"
                >
                  {/* Cart Basket */}
                  <path
                    d="M10 18h46l-5.5 24.5a3 3 0 0 1-2.9 2.5H18.4a3 3 0 0 1-2.9-2.5L10 18Z"
                    stroke="#74B83E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#74B83E"
                    fillOpacity="0.15"
                  />
                  {/* Wheels */}
                  <circle cx="21" cy="52" r="4.5" fill="#74B83E" />
                  <circle cx="45" cy="52" r="4.5" fill="#74B83E" />
                  {/* Cart Handle */}
                  <path
                    d="M6 18h4l3 12"
                    stroke="#74B83E"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Fresh Fruits inside Cart */}
                  <circle cx="23" cy="22" r="6.5" fill="#EF4444" />
                  <path
                    d="M23 15v3m-2-2 4 1"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="34" cy="20" r="7.5" fill="#F97316" />
                  <path
                    d="M34 12v3"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="43" cy="23" r="5.5" fill="#84CC16" />
                </svg>

                {/* Brand Text */}
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#74B83E] leading-none">
                    GROCA
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-zinc-300 uppercase leading-tight mt-0.5">
                    Grocery Mart
                  </span>
                </div>
              </div>
            </Link>

            {/* Address */}
            <div className="flex items-start gap-2.5 pt-2 text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
              <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <p>No: 58 A, East Madison Street,</p>
                <p>Baltimore, MD, USA 4508</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-300">
              <Phone className="w-4 h-4 text-white shrink-0" />
              <a
                href="tel:423-845-6570"
                className="hover:text-[#74B83E] transition-colors"
              >
                423-845-6570
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-zinc-300">
              <Mail className="w-4 h-4 text-white shrink-0" />
              <a
                href="mailto:random@email.com"
                className="hover:text-[#74B83E] transition-colors"
              >
                random@email.com
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="X (Twitter)"
                className="text-zinc-300 hover:text-[#74B83E] hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook"
                className="text-zinc-300 hover:text-[#74B83E] hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Pinterest"
                className="text-zinc-300 hover:text-[#74B83E] hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="text-zinc-300 hover:text-[#74B83E] hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* =========================================
              COLUMN 2: HELP
             ========================================= */}
          <div>
            <h3 className="text-base sm:text-lg font-bold italic text-white tracking-wide mb-4 sm:mb-5">
              Help
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                "Search",
                "Help",
                "Information",
                "Privacy Policy",
                "Shipping Information",
              ].map((name, idx) => (
                <li key={idx}>
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="group inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#74B83E] group-hover:translate-x-0.5 transition-all" />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =========================================
              COLUMN 3: SUPPORT
             ========================================= */}
          <div>
            <h3 className="text-base sm:text-lg font-bold italic text-white tracking-wide mb-4 sm:mb-5">
              Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                "Contact",
                "About Us",
                "Carrers",
                "Refund & Returns",
                "Deliveries",
              ].map((name, idx) => (
                <li key={idx}>
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="group inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#74B83E] group-hover:translate-x-0.5 transition-all" />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =========================================
              COLUMN 4: INFORMATION
             ========================================= */}
          <div>
            <h3 className="text-base sm:text-lg font-bold italic text-white tracking-wide mb-4 sm:mb-5">
              Information
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                "Search Terms",
                "Advanced Search",
                "Helps & Faqs",
                "Store Location",
                "Orders & Returns",
              ].map((name, idx) => (
                <li key={idx}>
                  <Link
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="group inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#74B83E] group-hover:translate-x-0.5 transition-all" />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subtle Bottom Copyright Bar */}
        <div className="mt-12 sm:mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>© Groca Grocery Mart. All Rights Reserved.</p>
          <p className="text-[11px] text-zinc-500">
            Powered by Fresh Organic Produce &amp; Daily Harvests.
          </p>
        </div>
      </div>
    </footer>
  );
}
