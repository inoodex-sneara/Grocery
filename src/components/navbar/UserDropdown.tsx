"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogIn, UserPlus, Package, Heart, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 sm:p-2 text-zinc-700 hover:text-[#74B83E] hover:bg-zinc-50 rounded-full transition-colors cursor-pointer"
        title="My Account"
        aria-expanded={isOpen}
      >
        <User className="w-5 h-5 stroke-[2.2]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-zinc-100 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 bg-zinc-50/70 rounded-t-xl">
            <p className="text-xs font-semibold text-zinc-800">Welcome to Groca</p>
            <p className="text-[11px] text-zinc-500">Sign in to track orders & offers</p>
            <div className="mt-2.5 flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-1.5 px-3 bg-[#74B83E] hover:bg-[#66a534] text-white text-xs font-medium rounded-md text-center transition-colors shadow-xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-1.5 px-3 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-medium rounded-md text-center transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-[#74B83E] transition-colors"
            >
              <Package className="w-4 h-4 text-zinc-400" />
              <span>My Orders</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-[#74B83E] transition-colors"
            >
              <Heart className="w-4 h-4 text-zinc-400" />
              <span>My Wishlist</span>
            </Link>
            <Link
              href="/account/settings"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-[#74B83E] transition-colors"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
