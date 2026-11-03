"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  HelpCircle,
  LockKeyhole,
  MapPin,
  Minus,
  Percent,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Tag,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import {
  BkashIcon,
  NagadIcon,
  CodIcon,
  CardIcon,
  UpayIcon,
} from "@/components/icons/PaymentIcons";
import { useCartStore } from "@/store/cartStore";
import {
  saveCheckoutOrder,
  type CheckoutPaymentMethod,
} from "@/store/checkoutOrder";
import { formatTaka } from "@/lib/currency";

const inputClass =
  "h-11 sm:h-12 w-full rounded-xl border border-zinc-300 bg-white px-3.5 sm:px-4 text-base sm:text-sm outline-none placeholder:text-zinc-400 focus:border-[#74b83e] focus:ring-2 focus:ring-[#74b83e]/20 transition-all";

const labelClass = "block text-xs font-semibold text-zinc-700 mb-1 sm:mb-1.5";

const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    tagline: "Pay with cash at your doorstep",
    badge: "Most Popular",
    color: "emerald",
    bgClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
    activeClass: "border-emerald-500 bg-emerald-50/40 ring-emerald-500/20",
    renderIcon: (className = "h-6 w-6") => <CodIcon className={className} />,
    merchantNumber: null,
  },
  {
    id: "bkash",
    name: "bKash",
    tagline: "Instant mobile payment",
    badge: "Fast MFS",
    color: "pink",
    bgClass: "bg-pink-50 text-[#E2136E] border-pink-200",
    activeClass: "border-[#E2136E] bg-pink-50/40 ring-[#E2136E]/20",
    renderIcon: (className = "h-6 w-6") => <BkashIcon className={className} />,
    merchantNumber: "01712-345678",
  },
  {
    id: "nagad",
    name: "Nagad",
    tagline: "Pay securely via Nagad",
    badge: "Low Charge",
    color: "orange",
    bgClass: "bg-orange-50 text-orange-600 border-orange-200",
    activeClass: "border-orange-500 bg-orange-50/40 ring-orange-500/20",
    renderIcon: (className = "h-6 w-6") => <NagadIcon className={className} />,
    merchantNumber: "01812-345678",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    tagline: "Visa, Mastercard, Amex",
    badge: "Encrypted",
    color: "indigo",
    bgClass: "bg-indigo-50 text-indigo-600 border-indigo-200",
    activeClass: "border-indigo-500 bg-indigo-50/40 ring-indigo-500/20",
    renderIcon: (className = "h-6 w-6") => <CardIcon className={className} />,
    merchantNumber: null,
  },
  {
    id: "upay",
    name: "Upay",
    tagline: "UCB mobile banking",
    badge: "MFS",
    color: "blue",
    bgClass: "bg-teal-50 text-teal-600 border-teal-200",
    activeClass: "border-teal-500 bg-teal-50/40 ring-teal-500/20",
    renderIcon: (className = "h-6 w-6") => <UpayIcon className={className} />,
    merchantNumber: "01912-345678",
  },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] =
    useState<CheckoutPaymentMethod>("cod");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [timeSlot, setTimeSlot] = useState<string>("today_morning");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [orderSaveError, setOrderSaveError] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [specialNotes, setSpecialNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    amount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const [cartHydrated, setCartHydrated] = useState(() =>
    useCartStore.persist?.hasHydrated() ?? false,
  );
  const [cartHydrationError, setCartHydrationError] = useState(false);

  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const currency = items[0]?.currency ?? "BDT";

  // Base shipping cost (৳20 standard, ৳50 express)
  const baseShipping = shippingMethod === "express" ? 50 : 20;
  // Free delivery threshold if subtotal >= 1500
  const isFreeDeliveryQualified = subtotal >= 1500;
  const shipping = isFreeDeliveryQualified
    ? shippingMethod === "express"
      ? 30
      : 0
    : baseShipping;

  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;

  const total = Math.max(0, subtotal - discountAmount + shipping);

  // Apply Coupon Logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const cleanCode = couponCode.trim().toUpperCase();

    if (!cleanCode) {
      setCouponError("Please enter a valid voucher code");
      return;
    }

    if (cleanCode === "GROCA10" || cleanCode === "SAVE10") {
      setAppliedCoupon({
        code: cleanCode,
        discountPercent: 10,
        amount: Math.round(subtotal * 0.1),
      });
      setCouponCode("");
    } else if (cleanCode === "FREEDEL") {
      setAppliedCoupon({
        code: cleanCode,
        discountPercent: 0,
        amount: shipping,
      });
      setCouponCode("");
    } else {
      setCouponError("Coupon code is invalid or has expired. Try GROCA10");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderSaveError("");

    if (!termsAccepted) {
      setOrderSaveError(
        "Please accept the terms and conditions to place your order.",
      );
      return;
    }

    if (
      (selectedPayment === "bkash" ||
        selectedPayment === "nagad" ||
        selectedPayment === "upay") &&
      (!paymentNumber.trim() || !transactionId.trim())
    ) {
      setOrderSaveError(
        `Please provide your ${selectedPayment.toUpperCase()} sender number and Transaction ID (TrxID).`,
      );
      return;
    }

    setIsSubmitting(true);

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

    const deliveryScheduleNote = `Slot: ${
      timeSlot === "today_morning"
        ? "Morning (9am - 12pm)"
        : timeSlot === "today_afternoon"
        ? "Afternoon (2pm - 5pm)"
        : "Evening (6pm - 9pm)"
    } [${shippingMethod === "express" ? "Express 60m" : "Standard"}]`;

    const notes = [deliveryScheduleNote, specialNotes.trim()]
      .filter(Boolean)
      .join(" | ");

    try {
      saveCheckoutOrder({
        id: `GRO-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto
          .randomUUID()
          .slice(0, 8)
          .toUpperCase()}`,
        createdAt: new Date().toISOString(),
        items: items.map((item) => ({ ...item })),
        subtotal,
        shipping,
        total,
        currency,
        paymentMethod: selectedPayment,
        ...(billingAddress ? { billingAddress } : {}),
        ...(notes ? { notes } : {}),
        customer,
      });

      clearCart();
      router.push("/confirmation");
    } catch (error) {
      console.error("Failed to save order", error);
      setIsSubmitting(false);
      setOrderSaveError(
        "We could not save your order. Please try again; your cart is unchanged.",
      );
    }
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

  const totalCartCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 antialiased pb-28 lg:pb-12">
      {/* =========================================
          1. TOP NAVIGATION & PROGRESS HEADER
         ========================================= */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl 2xl:max-w-[1536px] items-center justify-between px-3.5 sm:px-6 lg:px-8 2xl:px-12 py-3.5 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
            <Link
              href="/"
              className="group flex flex-col items-start font-lemonada text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#74b83e]"
            >
              <div className="flex items-center gap-1.5">
                <span>GROCA</span>
                <span className="inline-block h-2 w-2 rounded-full bg-[#f28a22]" />
              </div>
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors">
                GROCERY MART
              </span>
            </Link>

            {/* Stepper indicator on Tablet / Laptop / Desktop */}
            <nav
              aria-label="Checkout steps"
              className="hidden md:flex items-center gap-2 sm:gap-3 text-xs font-semibold text-zinc-400"
            >
              <Link
                href="/cart"
                className="flex items-center gap-1.5 hover:text-[#74b83e] transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#74b83e]/15 text-[11px] text-[#74b83e]">
                  ✓
                </span>
                <span>Cart</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
              <div className="flex items-center gap-1.5 text-zinc-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#74b83e] text-[11px] font-bold text-white shadow-xs">
                  2
                </span>
                <span className="font-bold">Checkout & Payment</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[11px] text-zinc-500">
                  3
                </span>
                <span>Confirmation</span>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>256-Bit SSL Secured</span>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-zinc-700 hover:border-[#74b83e] hover:bg-white hover:text-[#74b83e] transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Cart</span>
              <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold text-zinc-800">
                {totalCartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================
          2. CHECKOUT CONTENT AREA
         ========================================= */}
      <main className="mx-auto w-full max-w-7xl 2xl:max-w-[1536px] px-3.5 sm:px-6 lg:px-8 2xl:px-12 py-5 sm:py-8 lg:py-10 2xl:py-12">
        {cartHydrationError ? (
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 text-center shadow-xs"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900">
              Unable to load your cart
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Your cart data could not be verified. Please return to the shop or
              try again.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-xl bg-[#74b83e] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#639f33] transition-colors"
            >
              Return to store
            </Link>
          </div>
        ) : !cartHydrated ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#74b83e] mb-3" />
            <p className="text-sm font-medium text-zinc-600">
              Preparing your fresh grocery checkout…
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#74b83e] mb-5">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900">
              Your cart is empty
            </h1>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              Explore our freshly sourced fruits, vegetables, meat, and grocery
              essentials before starting checkout.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#74b83e] px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#639f33] transition-all hover:shadow-lg"
            >
              <span>Explore Products</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* MOBILE ONLY: Collapsible Order Summary Accordion Bar */}
            <div className="lg:hidden rounded-2xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-zinc-50/80 hover:bg-zinc-100 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-800">
                  <ShoppingBag className="h-4 w-4 text-[#74b83e]" />
                  <span>
                    {isMobileSummaryOpen
                      ? "Hide Order Summary"
                      : `Show Order Summary (${items.length} items)`}
                  </span>
                </div>
                <span className="text-sm sm:text-base font-black text-zinc-900">
                  {formatTaka(total)}
                </span>
              </button>

              {isMobileSummaryOpen && (
                <div className="p-4 border-t border-zinc-200 space-y-3 bg-white animate-in fade-in">
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative h-9 w-9 shrink-0 rounded-lg border border-zinc-200 bg-white p-0.5">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="36px"
                              className="rounded-md object-contain"
                            />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-bold text-white">
                              {item.quantity}
                            </span>
                          </div>
                          <span className="truncate font-semibold text-zinc-800">
                            {item.name}
                          </span>
                        </div>
                        <span className="shrink-0 font-bold text-zinc-900">
                          {formatTaka(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-800">
                        {formatTaka(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="font-semibold text-zinc-800">
                        {shipping === 0 ? "FREE" : formatTaka(shipping)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupon Discount</span>
                        <span>-{formatTaka(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-zinc-200 font-bold text-zinc-900 text-sm">
                      <span>Total Due</span>
                      <span className="text-[#74b83e]">
                        {formatTaka(total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FORM GRID: 12 Cols Layout across Desktop, Laptop & Mobile */}
            <form
              id="checkout-form"
              onSubmit={handleCheckoutSubmit}
              className="grid grid-cols-1 gap-6 pb-24 lg:pb-0 lg:grid-cols-12 lg:gap-8 xl:gap-10 2xl:gap-12 items-start"
            >
              {/* =========================================================
                  LEFT COLUMN: Customer Info, Shipping & Payment Steps
                  Mobile: 100% width
                  Laptop (lg: 1024-1280px): 7 of 12 cols
                  Desktop (xl/2xl: 1280px+): 7 or 8 of 12 cols
                 ========================================================= */}
              <div className="space-y-5 sm:space-y-6 lg:col-span-7 xl:col-span-7 2xl:col-span-8">
                {/* Free Shipping Alert Banner */}
                {isFreeDeliveryQualified ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-emerald-50 p-3.5 sm:p-4 text-emerald-900 shadow-2xs">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs text-base">
                      🎉
                    </span>
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold">
                        Congratulations! You've unlocked Free Standard Delivery!
                      </span>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Your order subtotal exceeds ৳1,500. Standard delivery fee is waived.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-3.5 sm:p-4 text-amber-900 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-amber-600 shrink-0" />
                      <p className="text-xs sm:text-sm font-medium">
                        Add{" "}
                        <span className="font-bold text-amber-800">
                          {formatTaka(1500 - subtotal)}
                        </span>{" "}
                        more to your cart for{" "}
                        <span className="font-bold text-emerald-700">
                          Free Delivery
                        </span>
                        !
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="shrink-0 text-xs font-bold text-amber-800 underline hover:text-amber-900"
                    >
                      Browse items
                    </Link>
                  </div>
                )}

                {/* STEP 1: Delivery Address & Customer Info */}
                <section className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 lg:p-7 2xl:p-8 shadow-xs">
                  <div className="flex items-center gap-3.5 mb-5 sm:mb-6 pb-4 border-b border-zinc-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#74b83e] text-sm font-black text-white shadow-xs">
                      1
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg 2xl:text-xl font-bold text-zinc-900 flex items-center gap-2">
                        <span>Delivery & Contact Details</span>
                        <MapPin className="h-4 w-4 text-[#74b83e]" />
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-500">
                        Enter the address where you want your fresh order delivered.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="e.g. Tanvir"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="e.g. Ahmed"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Mobile Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500">
                          +88
                        </span>
                        <input
                          className={`${inputClass} pl-12`}
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="01712345678"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="tanvir@example.com"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Delivery Street Address / Road / House{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        name="address"
                        autoComplete="address-line1"
                        placeholder="House # 12, Road # 5, Block C, Banani"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Apartment / Suite / Floor (Optional)
                      </label>
                      <input
                        className={inputClass}
                        name="apartment"
                        autoComplete="address-line2"
                        placeholder="Flat 4B, 4th Floor"
                      />
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                      <div>
                        <label className={labelClass}>
                          Country <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`${inputClass} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_14px_center] bg-no-repeat`}
                          name="country"
                          autoComplete="country-name"
                          defaultValue="Bangladesh"
                        >
                          <option value="Bangladesh">Bangladesh</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>
                          City / District <span className="text-red-500">*</span>
                        </label>
                        <input
                          className={inputClass}
                          name="city"
                          autoComplete="address-level2"
                          placeholder="Dhaka"
                          defaultValue="Dhaka"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          className={inputClass}
                          name="postalCode"
                          autoComplete="postal-code"
                          placeholder="1212"
                          defaultValue="1212"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-600">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded accent-[#74b83e] cursor-pointer"
                      />
                      <span>Save this address for fast checkout next time</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded accent-[#74b83e] cursor-pointer"
                      />
                      <span>Send tracking updates via SMS</span>
                    </label>
                  </div>
                </section>

          

                {/* STEP 3: Payment Method Selection */}
                <section className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-6 lg:p-7 2xl:p-8 shadow-xs">
                  <div className="flex items-center justify-between gap-3.5 mb-5 sm:mb-6 pb-4 border-b border-zinc-100">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#74b83e] text-sm font-black text-white shadow-xs">
                        3
                      </span>
                      <div>
                        <h2 className="text-base sm:text-lg 2xl:text-xl font-bold text-zinc-900 flex items-center gap-2">
                          <span>Payment Method</span>
                          <LockKeyhole className="h-4 w-4 text-[#74b83e]" />
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500">
                          Choose your preferred payment method. Encrypted & 100% safe.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Grid: 1 col on mobile, 2 col on tablet & wide desktop, 1 col on narrow laptop to avoid cramming */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 mb-5">
                    {paymentMethods.map(
                      ({
                        id,
                        name,
                        tagline,
                        badge,
                        bgClass,
                        activeClass,
                        renderIcon,
                      }) => {
                        const isSelected = selectedPayment === id;
                        return (
                          <label
                            key={id}
                            onClick={() => setSelectedPayment(id)}
                            className={`group relative flex cursor-pointer items-center gap-3 sm:gap-3.5 rounded-xl border p-3 sm:p-3.5 transition-all ${
                              isSelected
                                ? `ring-2 ${activeClass}`
                                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
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

                            {/* Custom Radio Circle */}
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                                isSelected
                                  ? id === "bkash"
                                    ? "border-[#E2136E] bg-[#E2136E]"
                                    : id === "nagad"
                                    ? "border-[#ED1C24] bg-[#ED1C24]"
                                    : "border-[#74b83e] bg-[#74b83e]"
                                  : "border-zinc-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </span>

                            {/* Icon Box */}
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border p-2 group-hover:scale-105 transition-all shadow-2xs ${
                                isSelected
                                  ? bgClass
                                  : "border-zinc-100 bg-zinc-50/80"
                              }`}
                            >
                              {renderIcon("h-6 w-6")}
                            </span>

                            {/* Name & Subtitle */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="text-xs sm:text-sm font-bold text-zinc-900">
                                  {name}
                                </span>
                                {badge && (
                                  <span
                                    className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold ${
                                      id === "bkash"
                                        ? "bg-pink-100 text-[#E2136E]"
                                        : id === "nagad"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-zinc-100 text-zinc-600"
                                    }`}
                                  >
                                    {badge}
                                  </span>
                                )}
                              </div>
                              <span className="block truncate text-[11px] sm:text-xs text-zinc-500 mt-0.5">
                                {tagline}
                              </span>
                            </div>

                            {isSelected && (
                              <Check
                                className={`h-4 w-4 shrink-0 ${
                                  id === "bkash"
                                    ? "text-[#E2136E]"
                                    : id === "nagad"
                                    ? "text-[#ED1C24]"
                                    : "text-[#74b83e]"
                                }`}
                              />
                            )}
                          </label>
                        );
                      },
                    )}
                  </div>

                  {/* Dynamic Payment Details Accordion */}
                  {(selectedPayment === "bkash" ||
                    selectedPayment === "nagad" ||
                    selectedPayment === "upay") && (
                    <div
                      className={`rounded-2xl border p-4 sm:p-6 space-y-4 animate-in fade-in duration-200 ${
                        selectedPayment === "bkash"
                          ? "border-pink-200 bg-gradient-to-b from-pink-50/40 via-white to-white"
                          : selectedPayment === "nagad"
                          ? "border-orange-200 bg-gradient-to-b from-orange-50/40 via-white to-white"
                          : "border-emerald-200 bg-gradient-to-b from-emerald-50/40 via-white to-white"
                      }`}
                    >
                      <div
                        className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                          selectedPayment === "bkash"
                            ? "border-pink-100"
                            : selectedPayment === "nagad"
                            ? "border-orange-100"
                            : "border-emerald-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border p-2 shadow-2xs ${
                              selectedPayment === "bkash"
                                ? "border-pink-200 bg-white"
                                : selectedPayment === "nagad"
                                ? "border-orange-200 bg-white"
                                : "border-teal-200 bg-white"
                            }`}
                          >
                            {selectedPayment === "bkash" ? (
                              <BkashIcon className="h-full w-full" />
                            ) : selectedPayment === "nagad" ? (
                              <NagadIcon className="h-full w-full" />
                            ) : (
                              <UpayIcon className="h-full w-full" />
                            )}
                          </div>
                          <div>
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                selectedPayment === "bkash"
                                  ? "text-[#E2136E]"
                                  : selectedPayment === "nagad"
                                  ? "text-[#ED1C24]"
                                  : "text-emerald-800"
                              }`}
                            >
                              {selectedPayment.toUpperCase()} Merchant Account
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-base sm:text-lg font-black tracking-wide text-zinc-900 font-mono">
                                {paymentMethods.find(
                                  (m) => m.id === selectedPayment,
                                )?.merchantNumber ?? "01712-345678"}
                              </span>
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                  selectedPayment === "bkash"
                                    ? "bg-pink-100 text-[#E2136E]"
                                    : selectedPayment === "nagad"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                Merchant
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-zinc-500">
                          Pay exact:{" "}
                          <strong className="text-zinc-900 font-bold">
                            {formatTaka(total)}
                          </strong>
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-600 leading-relaxed">
                        <p className="font-semibold text-zinc-800">
                          Quick Payment Instructions:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-zinc-500 pl-1">
                          <li>
                            Open your {selectedPayment.toUpperCase()} app or dial
                            USSD code.
                          </li>
                          <li>
                            Select <strong>"Make Payment"</strong> (or "Send
                            Money") to the number above.
                          </li>
                          <li>
                            Enter amount <strong>{formatTaka(total)}</strong> and
                            use reference <strong>GROCA</strong>.
                          </li>
                          <li>
                            Enter your sender mobile number and the received
                            Transaction ID (TrxID) below.
                          </li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                        <div>
                          <label className={labelClass}>
                            Sender {selectedPayment.toUpperCase()} Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            className={inputClass}
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="017XXXXXXXX"
                            value={paymentNumber}
                            onChange={(e) => setPaymentNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Transaction ID (TrxID){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            className={inputClass}
                            type="text"
                            autoComplete="off"
                            placeholder="e.g. 9J2KB810PX"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPayment === "cod" && (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 sm:p-4 text-xs text-zinc-600 flex items-start gap-3">
                      <span className="text-xl">💵</span>
                      <div>
                        <p className="font-bold text-zinc-800">
                          Cash on Delivery Available
                        </p>
                        <p className="mt-0.5 text-zinc-500 leading-relaxed">
                          Pay in cash when our delivery rider arrives with your
                          fresh items. Please keep exact change ready if possible.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPayment === "card" && (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 sm:p-4 text-xs text-zinc-600 flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-zinc-800">
                          Secure Bank Card Payment
                        </p>
                        <p className="mt-0.5 text-zinc-500 leading-relaxed">
                          Visa, Mastercard, DBBL Nexus, and American Express cards
                          are accepted. You will complete payment upon placing the
                          order.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Billing Address Toggle */}
                  <div className="mt-6 pt-5 border-t border-zinc-100">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="h-4 w-4 rounded accent-[#74b83e] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-zinc-700">
                        Billing address is identical to shipping address
                      </span>
                    </label>

                    {!sameAsShipping && (
                      <div className="mt-4 sm:mt-5 grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5 animate-in fade-in">
                        <div className="sm:col-span-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Separate Billing Address
                          </h4>
                        </div>
                        <div>
                          <label className={labelClass}>Billing First Name</label>
                          <input
                            className={inputClass}
                            name="billingFirstName"
                            placeholder="First name"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Billing Last Name</label>
                          <input
                            className={inputClass}
                            name="billingLastName"
                            placeholder="Last name"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Billing Address</label>
                          <input
                            className={inputClass}
                            name="billingAddress"
                            placeholder="Street, area, building"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Billing City</label>
                          <input
                            className={inputClass}
                            name="billingCity"
                            placeholder="City / District"
                            defaultValue="Dhaka"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Billing Postal Code</label>
                          <input
                            className={inputClass}
                            name="billingPostalCode"
                            placeholder="Postal code"
                            defaultValue="1212"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* =========================================================
                  RIGHT COLUMN: Sticky Order Summary & Checkout Trigger
                  Mobile: 100% width, flows naturally
                  Laptop (lg: 1024-1280px): 5 of 12 cols, sticky top
                  Desktop (xl/2xl: 1280px+): 5 or 4 of 12 cols, sticky top
                 ========================================================= */}
              <div className="space-y-5 sm:space-y-6 lg:col-span-5 xl:col-span-5 2xl:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto lg:pr-1 hover-scrollbar">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 lg:p-7 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4 sm:mb-5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base sm:text-lg 2xl:text-xl font-black text-zinc-900">
                        Order Summary
                      </h3>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#74b83e]">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <Link
                      href="/cart"
                      className="text-xs font-bold text-[#74b83e] hover:underline"
                    >
                      Edit Cart
                    </Link>
                  </div>

                  {/* Cart Items List */}
                  <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-100 hover-scrollbar">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 pt-3 first:pt-0"
                      >
                        {/* Product Thumbnail */}
                        <div className="relative h-13 w-13 sm:h-14 sm:w-14 shrink-0 rounded-xl border border-zinc-200 bg-white p-1 shadow-2xs">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="rounded-lg object-contain p-1"
                          />
                          <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-zinc-800 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                            {item.quantity}
                          </span>
                        </div>

                        {/* Product Name & Controls */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs sm:text-sm font-bold text-zinc-900">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {formatTaka(item.price)}
                            {item.unit ? ` · ${item.unit}` : ""}
                          </p>

                          {/* Inline quantity adjuster */}
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setQuantity(item.id, item.quantity - 1);
                                  } else {
                                    removeItem(item.id);
                                  }
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-white hover:text-zinc-900 transition-colors cursor-pointer"
                                title="Decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-[11px] font-bold text-zinc-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(item.id, item.quantity + 1)
                                }
                                className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-white hover:text-zinc-900 transition-colors cursor-pointer"
                                title="Increase"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Line Item Total */}
                        <span className="shrink-0 text-xs sm:text-sm font-extrabold text-zinc-900">
                          {formatTaka(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Box */}
                  <div className="mt-4 sm:mt-5 pt-4 border-t border-zinc-100">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code (e.g. GROCA10)"
                          className="h-10 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-9 pr-3 text-base sm:text-xs outline-none uppercase placeholder:normal-case placeholder:text-zinc-400 focus:bg-white focus:border-[#74b83e] focus:ring-2 focus:ring-[#74b83e]/15 transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="shrink-0 rounded-xl bg-[#74b83e] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#639f33] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                        {couponError}
                      </p>
                    )}

                    {appliedCoupon && (
                      <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{appliedCoupon.code} Applied</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[11px] text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cost Calculations */}
                  <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 border-t border-zinc-100 pt-4 text-xs sm:text-sm">
                    <div className="flex justify-between text-zinc-600">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-zinc-900">
                        {formatTaka(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-zinc-600">
                      <span className="flex items-center gap-1">
                        <span>Delivery Fee</span>
                        {shipping === 0 && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                            FREE
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-semibold ${
                          shipping === 0 ? "text-emerald-600" : "text-zinc-900"
                        }`}
                      >
                        {shipping === 0 ? "৳0" : formatTaka(shipping)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Voucher Discount</span>
                        <span>-{formatTaka(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-500 text-xs">
                      <span>Govt. VAT / Tax</span>
                      <span>Included in price</span>
                    </div>

                    <div className="border-t border-zinc-200 pt-3 flex items-baseline justify-between">
                      <div>
                        <span className="block text-base font-extrabold text-zinc-900">
                          Total Amount
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Includes all taxes & fees
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-[#74b83e]">
                        {formatTaka(total)}
                      </span>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="mt-4 sm:mt-5 pt-4 border-t border-zinc-100">
                    <label className="flex items-start gap-2.5 text-xs text-zinc-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#74b83e] cursor-pointer"
                      />
                      <span className="leading-5">
                        I agree to the{" "}
                        <Link
                          href="#"
                          className="text-[#74b83e] font-semibold underline"
                        >
                          Terms of Service
                        </Link>
                        ,{" "}
                        <Link
                          href="#"
                          className="text-[#74b83e] font-semibold underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        and return conditions.
                      </span>
                    </label>
                  </div>

                  {/* Desktop / In-Form Submission CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 sm:mt-5 w-full rounded-xl bg-[#74b83e] hover:bg-[#639f33] active:scale-[0.99] text-white py-3.5 sm:py-4 px-6 text-sm sm:text-base font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Placing your order…</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {selectedPayment === "cod"
                            ? "Confirm & Place Order"
                            : "Proceed to Pay"}
                        </span>
                        <span>·</span>
                        <span>{formatTaka(total)}</span>
                        <ChevronRight className="h-4 w-4 ml-0.5" />
                      </>
                    )}
                  </button>

                  {orderSaveError && (
                    <p
                      role="alert"
                      className="mt-3 text-xs text-center font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200"
                    >
                      {orderSaveError}
                    </p>
                  )}
                </div>

                {/* Trust Badges Card */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#74b83e]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900">
                        100% Fresh & Authentic
                      </p>
                      <p className="text-zinc-500">
                        Sourced daily from certified local farmers & genuine distributors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-zinc-100 pt-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#74b83e]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900">
                        On-Time Delivery Guarantee
                      </p>
                      <p className="text-zinc-500">
                        Delivered straight to your doorstep in temperature-controlled bags.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-zinc-100 pt-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#74b83e]">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900">
                        Need help with order?
                      </p>
                      <p className="text-zinc-500">
                        Call our customer hotline anytime at{" "}
                        <strong className="text-zinc-800">09612-GROCA-1</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* MOBILE ONLY: Sticky Floating Bottom Checkout Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              <div className="mx-auto grid max-w-lg grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
                <div className="min-w-0 shrink-0">
                  <span className="block text-[10px] text-zinc-400 font-medium">
                    Total Amount
                  </span>
                  <span className="block whitespace-nowrap text-lg font-black text-[#74b83e]">
                    {formatTaka(total)}
                  </span>
                </div>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#74b83e] hover:bg-[#639f33] active:scale-[0.98] text-white py-3 px-4 text-sm font-black shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Placing order…</span>
                    </>
                  ) : (
                    <>
                      <span className="truncate">
                        {selectedPayment === "cod"
                          ? "Place Order"
                          : "Proceed to Pay"}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
