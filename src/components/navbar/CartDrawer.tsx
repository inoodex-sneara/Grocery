"use client";

import { ShoppingBag, X, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
}

export default function CartDrawer({ isOpen, onClose, cartCount }: CartDrawerProps) {
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Fresh Cauliflower (Fulcopy)",
      price: 2.99,
      quantity: 1,
      image: "/products/65fa976ad61902ef2307cefc_Cauliflower-Fulcopy_1.webp",
      unit: "1 pc (approx 800g)",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof items
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md h-full max-h-screen max-h-dvh bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
          data-lenis-prevent
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#74B83E]/10 flex items-center justify-center text-[#74B83E]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-base">Your Cart</h3>
                <p className="text-xs text-zinc-500">{items.length} items in your basket</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-4 sm:p-5 divide-y divide-zinc-100 space-y-4 drawer-scroll"
            data-lenis-prevent
          >
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative w-18 h-18 rounded-lg bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-zinc-800 line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.unit}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-zinc-200 rounded-md">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-0.5 text-zinc-600 hover:bg-zinc-100 rounded-l text-sm"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-0.5 text-zinc-600 hover:bg-zinc-100 rounded-r text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#74B83E]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-zinc-700">Your basket is empty</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
                  Add some delicious fresh groceries to your cart to get started!
                </p>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-bold text-zinc-900 text-base">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Taxes and delivery fee calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-zinc-300 font-semibold text-xs sm:text-sm text-zinc-700 hover:bg-zinc-100 text-center transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-[#74B83E] hover:bg-[#66a534] font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
