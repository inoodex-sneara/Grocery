"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Menu } from "lucide-react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import UserDropdown from "./UserDropdown";
import SearchBox from "./SearchBox";
import CartDrawer from "./CartDrawer";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <header className="w-full bg-white border-b border-zinc-100 sticky top-0 z-40 shadow-xs">
      {/* =========================================
          ROW 1: MAIN NAVIGATION BAR
         ========================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4">
          {/* Left: Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 sm:p-2 text-zinc-700 hover:text-[#74B83E] hover:bg-zinc-50 rounded-lg lg:hidden transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <NavLinks />
          </div>

          {/* Right: User, Wishlist, Cart */}
          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2.5 shrink-0">
            {/* User Account */}
            <UserDropdown />

            {/* Wishlist / Heart Icon (visible on mobile and desktop) */}
            <Link
              href="/wishlist"
              className="relative p-1.5 sm:p-2 text-zinc-800 hover:text-red-500 hover:bg-zinc-50 rounded-full transition-colors inline-flex cursor-pointer group"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[2.2] group-hover:scale-105 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon with Badge (matches screenshot with badge '1') */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-zinc-800 hover:text-[#74B83E] hover:bg-zinc-50 rounded-full transition-colors cursor-pointer group"
              title="Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.2] group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-zinc-900 group-hover:bg-[#74B83E] text-white text-[11px] font-bold rounded-full flex items-center justify-center transition-colors shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          ROW 2: CATEGORY & SEARCH BAR
         ========================================= */}
      <div className="bg-white py-2.5 sm:py-3">
        <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <SearchBox />
        </div>
      </div>
      <div className="h-1 bg-[#d8f3b2] w-full" />

      {/* =========================================
          DRAWERS & MODALS
         ========================================= */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartCount={cartCount}
      />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
}
