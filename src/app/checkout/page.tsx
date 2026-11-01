"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  ShoppingBag,
  Truck,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowLeft,
  Sparkles,
  Clock,
  Leaf,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import {
  saveCheckoutOrder,
  type CheckoutPaymentMethod,
} from "@/store/checkoutOrder";
import { PRODUCTS, type Product } from "@/data/productsData";

// Modern form field input styles
const inputStyle =
  "w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-[#74B83E] focus:ring-3 focus:ring-[#74B83E]/15 hover:border-zinc-300";

// Currency formatter
const formatMoney = (amount: number, currency: "USD" | "BDT") => {
  if (currency === "BDT") {
    return `Tk ${Math.round(amount).toLocaleString()}`;
  }
  return `$${amount.toFixed(2)}`;
};

// Payment methods with official branding
const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    tagline: "Pay when you receive fresh items",
    badgeColor: "bg-[#74B83E] text-white",
    borderColor: "border-[#74B83E]",
    Icon: Banknote,
    iconUrl: null,
    instructions:
      "Pay with cash or mobile wallet directly to our delivery rider after inspecting your fresh products at your doorstep.",
  },
  {
    id: "bkash",
    name: "bKash",
    tagline: "Instant mobile payment",
    badgeColor: "bg-[#E2136E] text-white",
    borderColor: "border-[#E2136E]",
    Icon: Smartphone,
    iconUrl: "https://www.google.com/s2/favicons?domain=bkash.com&sz=64",
    instructions:
      "Send payment to our merchant wallet 01800-000000 (Counter 1). Enter your bKash mobile number and Transaction ID (TrxID) below.",
  },
  {
    id: "nagad",
    name: "Nagad",
    tagline: "Post Office digital service",
    badgeColor: "bg-[#F7941D] text-white",
    borderColor: "border-[#F7941D]",
    Icon: Smartphone,
    iconUrl: "https://www.google.com/s2/favicons?domain=nagad.com.bd&sz=64",
    instructions:
      "Send payment to our merchant wallet 01800-000000. Enter your Nagad phone number and Transaction ID (TrxID) below.",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    tagline: "Visa, Mastercard, Amex, UnionPay",
    badgeColor: "bg-[#1A1F71] text-white",
    borderColor: "border-[#1A1F71]",
    Icon: CreditCard,
    iconUrl: null,
    instructions:
      "Bank-grade 256-bit encrypted card gateway. Card payments are verified securely via Bangladesh Bank approved SSL portal.",
  },
  {
    id: "upay",
    name: "Upay",
    tagline: "UCB digital financial service",
    badgeColor: "bg-[#002D72] text-white",
    borderColor: "border-[#002D72]",
    Icon: Smartphone,
    iconUrl: "https://www.google.com/s2/favicons?domain=upaybd.com&sz=64",
    instructions:
      "Send payment to Upay wallet 01800-000000. Enter your phone number and Transaction ID below.",
  },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] =
    useState<CheckoutPaymentMethod>("cod");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [orderSaveError, setOrderSaveError] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [specialNotes, setSpecialNotes] = useState("");
  const [showOrderSummaryMobile, setShowOrderSummaryMobile] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "percent" | "fixed" | "free_ship";
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const [cartHydrated, setCartHydrated] = useState(() =>
    useCartStore.persist?.hasHydrated() ?? false,
  );
  const [cartHydrationError, setCartHydrationError] = useState(false);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const currency = items[0]?.currency ?? "BDT";

  // Base shipping calculation
  const baseShipping = currency === "USD" ? 1.5 : 60;
  const expressShipping = currency === "USD" ? 2.5 : 100;
  let activeShipping =
    shippingMethod === "express" ? expressShipping : baseShipping;

  // Free shipping threshold for BDT over 1,000 or USD over 20
  const isFreeShippingEligible =
    currency === "BDT" ? subtotal >= 1000 : subtotal >= 20;

  if (isFreeShippingEligible && shippingMethod === "standard") {
    activeShipping = 0;
  }

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = Math.min(subtotal, appliedCoupon.discount);
    } else if (appliedCoupon.type === "free_ship") {
      activeShipping = 0;
    }
  }

  const total = Math.max(0, subtotal + activeShipping - discountAmount);

  // Apply Coupon Logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "GROCA10") {
      setAppliedCoupon({ code: "GROCA10", discount: 10, type: "percent" });
      setCouponSuccess("10% discount applied!");
    } else if (code === "FREESHIP") {
      setAppliedCoupon({ code: "FREESHIP", discount: 0, type: "free_ship" });
      setCouponSuccess("Free delivery unlocked!");
    } else if (code === "SAVE50" || code === "WELCOME50") {
      const discount = currency === "USD" ? 1 : 50;
      setAppliedCoupon({ code, discount, type: "fixed" });
      setCouponSuccess(`${formatMoney(discount, currency)} discount applied!`);
    } else {
      setCouponError("Invalid coupon code. Try 'GROCA10' or 'FREESHIP'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderSaveError("");

    const formData = new FormData(event.currentTarget);
    const customer = {
      email: String(formData.get("email") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      country: String(formData.get("country") ?? "Bangladesh"),
      address: String(formData.get("address") ?? ""),
      apartment: String(formData.get("apartment") ?? ""),
      city: String(formData.get("city") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    };

    const billingAddress = sameAsShipping
      ? undefined
      : {
          firstName: String(formData.get("billingFirstName") ?? ""),
          lastName: String(formData.get("billingLastName") ?? ""),
          country: String(formData.get("billingCountry") ?? "Bangladesh"),
          address: String(formData.get("billingAddress") ?? ""),
          apartment: String(formData.get("billingApartment") ?? ""),
          city: String(formData.get("billingCity") ?? ""),
          postalCode: String(formData.get("billingPostalCode") ?? ""),
        };

    const notes = specialNotes.trim();

    try {
      saveCheckoutOrder({
        id: `GRO-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        items: items.map((item) => ({ ...item })),
        subtotal,
        shipping: activeShipping,
        total,
        currency,
        paymentMethod: selectedPayment,
        ...(billingAddress ? { billingAddress } : {}),
        ...(notes ? { notes } : {}),
        customer,
      });
    } catch (error) {
      console.error("Failed to save order", error);
      setOrderSaveError(
        "We couldn't save your order. Please try again; your cart is safe.",
      );
      return;
    }

    clearCart();
    router.push("/confirmation");
  }

  useEffect(() => {
    let active = true;
    const finishHydration = () => {
      if (active) setCartHydrated(true);
    };
    const unsubscribe = useCartStore.persist.onFinishHydration(finishHydration);

    if (useCartStore.persist.hasHydrated()) {
      finishHydration();
    } else {
      void Promise.resolve(useCartStore.persist.rehydrate())
        .then(finishHydration)
        .catch((error: unknown) => {
          console.error("Failed to restore cart before checkout.", error);
          if (active) setCartHydrationError(true);
        });
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FBFDF9]">
      {/* =========================================
          1. TOP GROCA GREEN HERO BANNER
         ========================================= */}
      <section
        aria-label="Checkout Header Banner"
        className="w-full bg-[#74B83E] py-8 sm:py-10 px-4 text-center relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-lemonada tracking-tight mb-2">
            Checkout
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-white/95 font-medium"
          >
            <Link href="/" className="hover:underline opacity-90 hover:opacity-100">
              Home
            </Link>
            <span className="opacity-70">/</span>
            <Link href="/cart" className="hover:underline opacity-90 hover:opacity-100">
              Cart
            </Link>
            <span className="opacity-70">/</span>
            <span className="font-semibold text-white">Checkout</span>
          </nav>
        </div>
      </section>

      {/* =========================================
          2. STEP PROGRESSION STRIP
         ========================================= */}
      <div className="border-b border-zinc-200/80 bg-white shadow-2xs py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-zinc-500 hover:text-[#74B83E] transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                ✓
              </span>
              <span>1. Cart</span>
            </Link>
            <span className="text-zinc-300">›</span>
            <div className="flex items-center gap-1.5 text-[#74B83E]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#74B83E] text-[11px] font-bold text-white shadow-xs">
                2
              </span>
              <span className="font-bold">2. Details &amp; Payment</span>
            </div>
            <span className="text-zinc-300">›</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-bold">
                3
              </span>
              <span>3. Order Complete</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Secure</span>
          </div>
        </div>
      </div>

      {/* =========================================
          3. MOBILE ACCORDION: ORDER SUMMARY BAR
         ========================================= */}
      {items.length > 0 && (
        <aside
          aria-label="Order summary"
          className="lg:hidden border-b border-zinc-200 bg-white px-4 py-3"
        >
          <button
            type="button"
            onClick={() => setShowOrderSummaryMobile(!showOrderSummaryMobile)}
            className="flex w-full items-center justify-between text-xs font-semibold text-zinc-700"
          >
            <div className="flex items-center gap-2 text-[#74B83E]">
              <ShoppingBag className="w-4 h-4" />
              <span>
                {showOrderSummaryMobile
                  ? "Hide order summary"
                  : `Show order summary (${items.length} ${
                      items.length === 1 ? "item" : "items"
                    })`}
              </span>
              {showOrderSummaryMobile ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-sm font-extrabold text-zinc-900">
              {formatMoney(total, currency)}
            </span>
          </button>

          {showOrderSummaryMobile && (
            <div className="mt-4 pt-3 border-t border-zinc-100 space-y-3 animate-in fade-in duration-200">
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg border border-zinc-100 bg-white p-1">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-0.5"
                      />
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#74B83E] text-[10px] font-bold text-white shadow-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Qty: {item.quantity} {item.unit ? `· ${item.unit}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-zinc-800">
                      {formatMoney(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span>
                    {activeShipping === 0
                      ? "FREE"
                      : formatMoney(activeShipping, currency)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatMoney(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-zinc-900 pt-1 text-sm border-t border-zinc-100">
                  <span>Total</span>
                  <span className="text-[#74B83E]">
                    {formatMoney(total, currency)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* =========================================
          4. MAIN CHECKOUT SECTION
         ========================================= */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cartHydrationError ? (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md border border-zinc-200">
            <h1 className="text-2xl font-bold text-zinc-900">
              Unable to load your cart
            </h1>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              Please return to your cart and try again.
            </p>
            <Link
              href="/cart"
              className="mt-6 inline-flex rounded-full bg-[#74B83E] hover:bg-[#639f33] px-6 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
            >
              Return to cart
            </Link>
          </div>
        ) : !cartHydrated ? (
          <div className="mx-auto max-w-md py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#74B83E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-600">
              Securing your checkout session…
            </p>
          </div>
        ) : items.length ? (
          <form
            onSubmit={handleCheckoutSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start"
          >
            {/* =========================================
                LEFT COLUMN (7 cols): UNIFIED CHECKOUT FORM
               ========================================= */}
            <div className="space-y-6 lg:col-span-7 xl:col-span-8">
              {/* Back to Cart link */}
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#74B83E] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shopping Cart</span>
              </Link>

              {/* Free Shipping Progress Alert Banner */}
              {currency === "BDT" && (
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    isFreeShippingEligible
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-[#ecf7e6] border-[#74B83E]/30 text-zinc-800"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isFreeShippingEligible
                        ? "bg-emerald-600 text-white"
                        : "bg-[#74B83E] text-white"
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    {isFreeShippingEligible ? (
                      <p className="font-bold text-emerald-800">
                        🎉 You have unlocked Free Standard Delivery on this
                        order!
                      </p>
                    ) : (
                      <p>
                        Add{" "}
                        <span className="font-bold text-[#74B83E]">
                          Tk {1000 - subtotal}
                        </span>{" "}
                        more of fresh items to enjoy{" "}
                        <span className="font-bold text-zinc-900">
                          FREE Delivery
                        </span>
                        !
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* UNIFIED CUSTOMER & DELIVERY DETAILS CARD */}
              <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-zinc-200/80 space-y-8">
                {/* 1. Contact Information */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                    <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#74B83E] text-xs font-bold text-white">
                        1
                      </span>
                      <span>Customer Contact</span>
                    </h2>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Order updates &amp; receipt
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        className={inputStyle}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="e.g. name@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        className={inputStyle}
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  <label className="mt-3 flex items-center gap-2 text-xs text-zinc-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-[#74B83E] accent-[#74B83E] cursor-pointer"
                    />
                    <span>
                      Send me instant delivery updates via SMS / WhatsApp
                    </span>
                  </label>
                </div>

                {/* 2. Shipping Address */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                    <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#74B83E] text-xs font-bold text-white">
                        2
                      </span>
                      <span>Delivery Address</span>
                    </h2>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Doorstep location
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        First Name *
                      </label>
                      <input
                        className={inputStyle}
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        className={inputStyle}
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="Last name"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Full Address / House / Road / Area *
                      </label>
                      <input
                        className={inputStyle}
                        name="address"
                        autoComplete="address-line1"
                        placeholder="House no., Building name, Road / Area"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Apartment / Flat / Floor / Landmark (Optional)
                      </label>
                      <input
                        className={inputStyle}
                        name="apartment"
                        autoComplete="address-line2"
                        placeholder="Flat 4B, Floor 4, or nearby landmark"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        City / District *
                      </label>
                      <input
                        className={inputStyle}
                        name="city"
                        autoComplete="address-level2"
                        placeholder="e.g. Dhaka, Chittagong, Sylhet"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Postal Code / Area Code *
                      </label>
                      <input
                        className={inputStyle}
                        name="postalCode"
                        autoComplete="postal-code"
                        placeholder="e.g. 1205"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Country *
                      </label>
                      <select
                        className={inputStyle}
                        name="country"
                        autoComplete="country-name"
                        defaultValue="Bangladesh"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Delivery Speed */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                    <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#74B83E] text-xs font-bold text-white">
                        3
                      </span>
                      <span>Delivery Speed</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Standard Delivery */}
                    <label
                      onClick={() => setShippingMethod("standard")}
                      className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        shippingMethod === "standard"
                          ? "border-[#74B83E] bg-[#ecf7e6]/50 shadow-xs"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === "standard"
                              ? "border-[#74B83E] bg-[#74B83E]"
                              : "border-zinc-300 bg-white"
                          }`}
                        >
                          {shippingMethod === "standard" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-zinc-900">
                            Standard Fresh Delivery
                          </span>
                          <span className="block text-[11px] text-zinc-500 mt-0.5">
                            Within 24 Hours
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-zinc-900">
                        {isFreeShippingEligible
                          ? "FREE"
                          : formatMoney(baseShipping, currency)}
                      </span>
                    </label>

                    {/* Express Priority */}
                    <label
                      onClick={() => setShippingMethod("express")}
                      className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        shippingMethod === "express"
                          ? "border-[#74B83E] bg-[#ecf7e6]/50 shadow-xs"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            shippingMethod === "express"
                              ? "border-[#74B83E] bg-[#74B83E]"
                              : "border-zinc-300 bg-white"
                          }`}
                        >
                          {shippingMethod === "express" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                            <span>Express Priority</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-amber-500 text-white">
                              Fast
                            </span>
                          </span>
                          <span className="block text-[11px] text-zinc-500 mt-0.5">
                            2 to 4 Hours Delivery
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-zinc-900">
                        {formatMoney(expressShipping, currency)}
                      </span>
                    </label>
                  </div>
                </div>

                {/* 4. Payment Method */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
                    <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#74B83E] text-xs font-bold text-white">
                        4
                      </span>
                      <span>Payment Method</span>
                    </h2>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>100% Secure</span>
                    </div>
                  </div>

                  <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <legend className="sr-only">Choose a payment method</legend>
                    {paymentMethods.map(
                      ({ id, name, tagline, Icon, iconUrl }) => {
                        const isSelected = selectedPayment === id;
                        return (
                          <label
                            key={id}
                            className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#74B83E] bg-[#ecf7e6]/50 shadow-xs"
                                : "border-zinc-200 bg-white hover:border-zinc-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={id}
                              checked={isSelected}
                              onChange={() => setSelectedPayment(id)}
                              className="sr-only"
                            />

                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-[#74B83E] bg-[#74B83E]"
                                  : "border-zinc-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 p-1">
                              {iconUrl ? (
                                <Image
                                  src={iconUrl}
                                  alt={`${name} logo`}
                                  width={24}
                                  height={24}
                                  unoptimized
                                  className="h-5 w-5 rounded-full object-contain"
                                />
                              ) : (
                                <Icon
                                  className={`h-5 w-5 ${
                                    id === "card"
                                      ? "text-indigo-600"
                                      : "text-[#74B83E]"
                                  }`}
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-zinc-900 truncate">
                                {name}
                              </span>
                              <span className="block text-[10px] text-zinc-500 truncate">
                                {tagline}
                              </span>
                            </div>

                            {isSelected && (
                              <Check className="h-4 w-4 shrink-0 text-[#74B83E]" />
                            )}
                          </label>
                        );
                      },
                    )}
                  </fieldset>

                  {/* Mobile Wallet Sender Form (bKash / Nagad / Upay) */}
                  {(selectedPayment === "bkash" ||
                    selectedPayment === "nagad" ||
                    selectedPayment === "upay") && (
                    <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p>
                          {
                            paymentMethods.find(
                              (method) => method.id === selectedPayment,
                            )?.instructions
                          }
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Sender Mobile Number *
                          </label>
                          <input
                            className={inputStyle}
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={paymentNumber}
                            onChange={(e) => setPaymentNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            className={inputStyle}
                            type="text"
                            placeholder="e.g. 9B87F6A123"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Note */}
                  {selectedPayment === "cod" && (
                    <div className="mt-4 p-3.5 rounded-xl bg-[#ecf7e6]/70 border border-[#74B83E]/30 text-xs text-zinc-700 flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#74B83E] shrink-0" />
                      <span>
                        Zero advance payment needed. Inspect the freshness at
                        your door and pay with cash or bKash to our rider.
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. Special Instructions & Billing Address */}
                <div className="pt-2 border-t border-zinc-100 space-y-4">
                  <div>
                    <label
                      htmlFor="special-notes"
                      className="block text-xs font-bold text-zinc-800 mb-1.5"
                    >
                      Special Delivery Instructions{" "}
                      <span className="font-normal text-zinc-400">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      id="special-notes"
                      name="notes"
                      rows={2}
                      maxLength={140}
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Ring the bell twice, leave at reception, or gate code 1234"
                      className="w-full p-3 rounded-xl border border-zinc-200 text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#74B83E] focus:ring-2 focus:ring-[#74B83E]/15 resize-none"
                    />
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                      <span>Helps our rider reach you smoothly</span>
                      <span>{specialNotes.length}/140</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4 rounded text-[#74B83E] accent-[#74B83E]"
                    />
                    <span>Billing address is same as shipping address</span>
                  </label>
                </div>
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-2.5 px-2 text-xs text-zinc-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="mt-0.5 w-4 h-4 rounded text-[#74B83E] accent-[#74B83E] shrink-0"
                />
                <span>
                  I agree to the Groca{" "}
                  <Link href="/terms" className="text-[#74B83E] hover:underline font-semibold">
                    Terms &amp; Conditions
                  </Link>
                  ,{" "}
                  <Link href="/privacy" className="text-[#74B83E] hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  , and 100% Freshness Guarantee policy.
                </span>
              </label>

              {orderSaveError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {orderSaveError}
                </div>
              )}
            </div>

            {/* =========================================
                RIGHT COLUMN (5 cols): STICKY ORDER SUMMARY
               ========================================= */}
            <div className="lg:col-span-5 xl:col-span-4">
              <aside
                aria-label="Order summary sidebar"
                className="sticky top-24 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-zinc-200/90 space-y-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#74B83E]" />
                    <span>Order Summary</span>
                  </h2>
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items List */}
                <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-50">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 pt-2.5 first:pt-0"
                    >
                      <div className="relative h-14 w-14 shrink-0 rounded-xl border border-zinc-200/80 bg-white p-1">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-contain p-1 rounded-lg"
                        />
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#74B83E] text-[11px] font-black text-white shadow-xs">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-xs sm:text-sm font-bold text-zinc-900">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {item.unit || "Fresh pack"} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs sm:text-sm font-extrabold text-zinc-900">
                        {formatMoney(item.price * item.quantity, item.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-zinc-100">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>Code &quot;{appliedCoupon.code}&quot; applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Coupon code (e.g. GROCA10)"
                            className="w-full h-10 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 uppercase tracking-wider focus:outline-none focus:border-[#74B83E]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 h-10 rounded-xl bg-zinc-900 hover:bg-[#74B83E] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-rose-600 font-medium">
                          {couponError}
                        </p>
                      )}
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-600 font-bold">
                          {couponSuccess}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-100 text-xs sm:text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">
                      {formatMoney(subtotal, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery fee</span>
                    <span
                      className={`font-semibold ${
                        activeShipping === 0
                          ? "text-emerald-600 font-bold"
                          : "text-zinc-900"
                      }`}
                    >
                      {activeShipping === 0
                        ? "FREE"
                        : formatMoney(activeShipping, currency)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>-{formatMoney(discountAmount, currency)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline pt-3 border-t border-zinc-200">
                    <div>
                      <span className="block text-sm sm:text-base font-extrabold text-zinc-900">
                        Total Amount
                      </span>
                      <span className="block text-[10px] text-zinc-400 font-medium">
                        Including VAT &amp; organic packaging
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#74B83E]">
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                </div>

                {/* Main Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {selectedPayment === "cod"
                      ? "Place Order Cash on Delivery"
                      : "Confirm & Complete Order"}{" "}
                    · {formatMoney(total, currency)}
                  </span>
                </button>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50">
                    <Truck className="w-4 h-4 text-[#74B83E] mx-auto mb-1" />
                    <span className="block text-[10px] font-bold text-zinc-700">
                      Fast Delivery
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50">
                    <Leaf className="w-4 h-4 text-[#74B83E] mx-auto mb-1" />
                    <span className="block text-[10px] font-bold text-zinc-700">
                      100% Fresh
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50">
                    <ShieldCheck className="w-4 h-4 text-[#74B83E] mx-auto mb-1" />
                    <span className="block text-[10px] font-bold text-zinc-700">
                      Money Back
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        ) : (
          /* Empty Cart State with Recommended Quick-Add Items */
          <div className="mx-auto max-w-3xl my-6">
            <div className="rounded-2xl bg-white p-8 sm:p-12 text-center shadow-sm border border-zinc-200/80 mb-8">
              <div className="w-16 h-16 rounded-full bg-[#ecf7e6] text-[#74B83E] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-2">
                Your shopping cart is empty
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-6">
                You haven&apos;t added any items to your cart yet. Add fresh daily
                essentials below or explore our complete catalog!
              </p>
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-[#74B83E] hover:bg-[#639f33] px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95"
              >
                Browse All Products
              </Link>
            </div>

            {/* Quick Add Essentials */}
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 mb-4 text-center sm:text-left">
                Quick Add Daily Essentials:
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PRODUCTS.slice(0, 4).map((p) => (
                  <div
                    key={p.slug}
                    className="bg-white rounded-2xl border border-zinc-200/80 p-3 flex flex-col justify-between hover:border-[#74B83E] hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square w-full bg-zinc-50 rounded-xl mb-2 flex items-center justify-center p-2">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="text-xs font-bold text-zinc-900 truncate">
                        {p.name}
                      </h3>
                      <p className="text-xs font-extrabold text-[#74B83E]">
                        Tk {Math.round(p.price >= 20 ? p.price : p.price * 80)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          addItem({
                            id: p.slug,
                            name: p.name,
                            price: Math.round(
                              p.price >= 20 ? p.price : p.price * 80,
                            ),
                            image: p.image,
                            quantity: 1,
                            currency: "BDT",
                          })
                        }
                        className="w-full mt-1.5 py-1.5 rounded-full bg-[#74B83E] hover:bg-[#639f33] text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
