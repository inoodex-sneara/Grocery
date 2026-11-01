"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  CreditCard,
  LockKeyhole,
  Smartphone,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import {
  saveCheckoutOrder,
  type CheckoutPaymentMethod,
} from "@/store/checkoutOrder";

const field =
  "h-[36px] w-full rounded-md border border-zinc-300 bg-white px-3 text-xs outline-none placeholder:text-zinc-400 focus:border-[#74b83e] focus:ring-2 focus:ring-[#74b83e]/15";

const money = (amount: number, currency: "USD" | "BDT") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

const paymentMethods = [
  {
    id: "bkash",
    name: "bKash",
    description: "Mobile financial service",
    Icon: Smartphone,
    iconUrl: "https://www.google.com/s2/favicons?domain=bkash.com&sz=64",
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Mobile financial service",
    Icon: Smartphone,
    iconUrl: "https://www.google.com/s2/favicons?domain=nagad.com.bd&sz=64",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive",
    Icon: Banknote,
    iconUrl: null,
  },
  {
    id: "card",
    name: "Card",
    description: "Visa · Mastercard · Amex",
    Icon: CreditCard,
    iconUrl: null,
  },
  {
    id: "upay",
    name: "Upay",
    description: "Mobile financial service",
    Icon: Smartphone,
    iconUrl: "https://www.google.com/s2/favicons?domain=upaybd.com&sz=64",
  },
] as const;

const paymentNotes: Record<CheckoutPaymentMethod, string> = {
  bkash: "bKash payment instructions will be provided after you place your order.",
  nagad: "Nagad payment instructions will be provided after you place your order.",
  cod: "Pay for your order when it is delivered.",
  card: "Card payments will be handled securely when payment processing is connected.",
  upay: "Upay payment instructions will be provided after you place your order.",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] =
    useState<CheckoutPaymentMethod>("bkash");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [orderSaveError, setOrderSaveError] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [specialNotes, setSpecialNotes] = useState("");
  const [cartHydrated, setCartHydrated] = useState(() =>
    useCartStore.persist?.hasHydrated() ?? false,
  );
  const [cartHydrationError, setCartHydrationError] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const currency = items[0]?.currency ?? "USD";
  const shipping = currency === "USD" ? 0.21 : 20;
  const total = subtotal + shipping;

  function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderSaveError("");

    const formData = new FormData(event.currentTarget);
    const customer = {
      email: String(formData.get("email") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      country: String(formData.get("country") ?? ""),
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
          country: String(formData.get("billingCountry") ?? ""),
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
        shipping,
        total,
        currency,
        paymentMethod: selectedPayment,
        ...(billingAddress ? { billingAddress } : {}),
        ...(notes ? { notes } : {}),
        customer,
      });
    } catch (error) {
      console.error("Failed to save the order before opening its invoice.", error);
      setOrderSaveError(
        "We couldn't save your order. Please try again; your cart is unchanged.",
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
    <main className="min-h-screen bg-[#f1f3f7]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="font-lemonada text-2xl font-extrabold tracking-wide text-[#74b83e]"
          >
            GROCA
            <span className="block text-[10px] leading-none tracking-widest text-zinc-500">
              GROCERY MART
            </span>
          </Link>
          <Link
            href="/cart"
            aria-label="Return to cart"
            className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {cartHydrationError ? (
        <div
          role="alert"
          className="mx-auto max-w-lg px-5 py-24 text-center"
        >
          <h1 className="text-2xl font-bold">Unable to load your cart</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Please return to your cart and try again.
          </p>
          <Link
            href="/cart"
            className="mt-6 inline-flex rounded-full bg-[#83c945] px-6 py-3 text-sm font-semibold text-white"
          >
            Return to cart
          </Link>
        </div>
      ) : !cartHydrated ? (
        <div
          role="status"
          className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-zinc-500"
        >
          Loading your cart…
        </div>
      ) : items.length ? (
        <form
          onSubmit={handleCheckoutSubmit}
          className="mx-auto grid w-full max-w-[1056px] grid-cols-1 gap-3 px-4 py-6 sm:px-5 sm:py-8 lg:grid-cols-[1.4fr_1fr] lg:items-start"
        >
          <div className="space-y-3">
            <section className="rounded-xl bg-white p-3.5 shadow-sm sm:p-4">
              <h1 className="mb-4 border-l-2 border-[#f28a22] pl-2 text-sm font-semibold text-zinc-800">
                Order review
              </h1>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg border border-zinc-200 bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="rounded-lg object-contain p-1"
                      />
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-600 text-[10px] text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Qty: {item.quantity}
                        {item.unit ? ` · ${item.unit}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-zinc-800">
                      {money(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-3.5 shadow-sm sm:p-4">
              <h2 className="mb-4 border-l-2 border-[#f28a22] pl-2 text-sm font-semibold text-zinc-800">
                Shipping address
              </h2>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input
                  className={field}
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="First name"
                  required
                />
                <input
                  className={field}
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Last name"
                  required
                />
                <input
                  className={field}
                  name="phone"
                  autoComplete="tel"
                  placeholder="Phone number"
                  type="tel"
                  required
                />
                <input
                  className={`${field} sm:col-span-2`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email address"
                  required
                />
                <input
                  className={`${field} sm:col-span-2`}
                  name="address"
                  autoComplete="address-line1"
                  placeholder="House no. / building / street / area"
                  required
                />
                <input
                  className={`${field} sm:col-span-2`}
                  name="apartment"
                  autoComplete="address-line2"
                  placeholder="Apartment, suite, etc. (optional)"
                />
                <select
                  className={field}
                  name="country"
                  autoComplete="country-name"
                  defaultValue="Bangladesh"
                >
                  <option>Bangladesh</option>
                  <option>United States</option>
                  <option>India</option>
                </select>
                <input
                  className={field}
                  name="city"
                  autoComplete="address-level2"
                  placeholder="City / District"
                  required
                />
                <input
                  className={field}
                  name="postalCode"
                  autoComplete="postal-code"
                  placeholder="Postal code"
                  required
                />
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs">
                <input type="checkbox" className="accent-[#74b83e]" />
                Email me with news and offers
              </label>
            </section>

            <section className="rounded-xl bg-white p-3.5 shadow-sm sm:p-4">
              <h2 className="mb-3 border-l-2 border-[#f28a22] pl-2 text-sm font-semibold text-zinc-800">
                Shipping method
              </h2>
              <label className="flex h-[36px] items-center justify-between rounded-md border border-zinc-300 bg-zinc-50 px-3 text-xs">
                <span>Standard delivery</span>
                <span>{money(shipping, currency)}</span>
              </label>
            </section>

            <section className="rounded-xl bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="border-l-2 border-[#f28a22] pl-2 text-sm font-semibold text-zinc-800">
                  Billing address
                </h2>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-600">
                  Same as shipping
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(event) =>
                      setSameAsShipping(event.target.checked)
                    }
                    className="h-4 w-4 accent-[#f28a22]"
                  />
                </label>
              </div>
              {!sameAsShipping && (
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <input
                    className={field}
                    name="billingFirstName"
                    placeholder="First name"
                    autoComplete="billing given-name"
                    required
                  />
                  <input
                    className={field}
                    name="billingLastName"
                    placeholder="Last name"
                    autoComplete="billing family-name"
                    required
                  />
                  <input
                    className={`${field} sm:col-span-2`}
                    name="billingAddress"
                    placeholder="Billing address"
                    autoComplete="billing address-line1"
                    required
                  />
                  <input
                    className={`${field} sm:col-span-2`}
                    name="billingApartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    autoComplete="billing address-line2"
                  />
                  <select
                    className={field}
                    name="billingCountry"
                    autoComplete="billing country-name"
                    defaultValue="Bangladesh"
                    required
                  >
                    <option>Bangladesh</option>
                    <option>United States</option>
                    <option>India</option>
                  </select>
                  <input
                    className={field}
                    name="billingCity"
                    placeholder="City / District"
                    autoComplete="billing address-level2"
                    required
                  />
                  <input
                    className={field}
                    name="billingPostalCode"
                    placeholder="Postal code"
                    autoComplete="billing postal-code"
                    required
                  />
                </div>
              )}
            </section>
          </div>

          <div className="space-y-3">
            <section className="rounded-xl bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between">
                <h2 className="border-l-2 border-[#f28a22] pl-2 text-sm font-semibold text-zinc-800">
                  Payment method
                </h2>
                <LockKeyhole className="h-4 w-4 text-zinc-400" />
              </div>
              <fieldset className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <legend className="sr-only">Choose a payment method</legend>
                {paymentMethods.map(
                  ({ id, name, description, Icon, iconUrl }) => {
                  const isSelected = selectedPayment === id;

                  return (
                    <label
                      key={id}
                      className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors ${
                        isSelected
                          ? "border-[#f28a22] bg-orange-50"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={id}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedPayment(id);
                        }}
                        className="sr-only"
                      />
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-50">
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt={`${name} logo`}
                            width={20}
                            height={20}
                            unoptimized
                            className="h-4 w-4 rounded-full object-contain"
                          />
                        ) : (
                          <Icon
                            aria-hidden="true"
                            className={`h-4 w-4 ${
                              id === "card"
                                ? "text-indigo-500"
                                : "text-emerald-600"
                            }`}
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">
                          {name}
                        </span>
                        <span className="block truncate text-[10px] text-zinc-500">
                          {description}
                        </span>
                      </span>
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-[#f28a22]"
                        />
                      )}
                    </label>
                  );
                  },
                )}
              </fieldset>
              {(selectedPayment === "bkash" ||
                selectedPayment === "nagad" ||
                selectedPayment === "upay") && (
                <div className="mt-3 space-y-3 rounded-lg border border-zinc-200 p-3">
                  <p className="text-xs leading-5 text-zinc-600">
                    Complete the{" "}
                    {paymentMethods.find(
                      (method) => method.id === selectedPayment,
                    )?.name}{" "}
                    payment, then enter the mobile number used and its
                    transaction ID.
                  </p>
                  <label className="block text-xs font-medium">
                    Sender mobile number
                    <input
                      className={`${field} mt-1.5`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="01XXXXXXXXX"
                      value={paymentNumber}
                      onChange={(event) => setPaymentNumber(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-xs font-medium">
                    Transaction ID (TrxID)
                    <input
                      className={`${field} mt-1.5`}
                      type="text"
                      autoComplete="off"
                      placeholder="Enter your transaction ID"
                      value={transactionId}
                      onChange={(event) => setTransactionId(event.target.value)}
                      required
                    />
                  </label>
                </div>
              )}
              <p className="mt-3 rounded-md bg-zinc-50 px-3 py-2.5 text-xs leading-5 text-zinc-600">
                {paymentNotes[selectedPayment]}
              </p>
            </section>

            <section className="overflow-hidden rounded-xl bg-white shadow-sm">
              <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-medium text-zinc-800 sm:px-5">
                Have a coupon, gift voucher, or referral code?
              </h2>
              <div className="flex gap-2 p-3 sm:p-4">
                <input
                  className={`${field} min-w-0 flex-1`}
                  type="text"
                  placeholder="Enter coupon or referral code"
                  disabled
                  aria-describedby="coupon-unavailable"
                />
                <button
                  type="button"
                  disabled
                  className="shrink-0 rounded-md bg-[#f28a22] px-3 text-xs font-semibold text-white opacity-60"
                >
                  Apply
                </button>
              </div>
              <p id="coupon-unavailable" className="px-4 pb-3 text-[11px] text-zinc-500 sm:px-5">
                Coupon codes are not available yet.
              </p>
            </section>

            <section className="rounded-xl bg-white p-3.5 text-sm shadow-sm sm:p-4">
              <div className="space-y-2.5">
                <div className="flex justify-between gap-4 text-zinc-600">
                  <span>Subtotal</span>
                  <span>{money(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between gap-4 text-zinc-600">
                  <span>Delivery cost</span>
                  <span>{money(shipping, currency)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 font-semibold text-zinc-900">
                  <span>Total</span>
                  <span>{money(total, currency)}</span>
                </div>
              </div>
              <Link
                href="/cart"
                className="mt-3 inline-block text-xs font-medium text-[#54892f] underline"
              >
                Return to cart
              </Link>
            </section>

            <section className="rounded-xl bg-white p-3.5 shadow-sm sm:p-4">
              <label
                htmlFor="special-notes"
                className="mb-3 block border-l-2 border-[#f28a22] pl-2 text-sm font-semibold text-zinc-800"
              >
                Special notes{" "}
                <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <textarea
                id="special-notes"
                name="notes"
                rows={3}
                maxLength={90}
                value={specialNotes}
                onChange={(event) => setSpecialNotes(event.target.value)}
                placeholder="Add delivery instructions or other notes"
                className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs outline-none placeholder:text-zinc-400 focus:border-[#74b83e] focus:ring-2 focus:ring-[#74b83e]/15"
              />
              <p className="mt-1 text-[10px] text-zinc-500">
                {specialNotes.length} / 90 characters
              </p>
            </section>

            <label className="flex cursor-pointer items-start gap-2 rounded-lg px-1 py-1 text-xs leading-5 text-zinc-600">
              <input
                type="checkbox"
                name="termsAccepted"
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#f28a22]"
              />
              <span>
                I have read and agree to the Terms and Conditions, Privacy
                Policy, and Refund and Return Policy.
              </span>
            </label>

            <button className="w-full rounded-md bg-[#f28a22] px-5 py-3.5 text-sm font-bold uppercase text-white transition-colors hover:bg-[#df7712]">
              {selectedPayment === "cod" ? "Place order" : "Continue"} ·{" "}
              {money(total, currency)}
            </button>
            {orderSaveError && (
              <p role="alert" className="text-sm text-red-600">
                {orderSaveError}
              </p>
            )}
            <p className="text-center text-xs text-zinc-400">
              All rights reserved Groca
            </p>
          </div>
        </form>
      ) : (
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Add products before you start checkout.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-[#83c945] px-6 py-3 text-sm font-semibold text-white"
          >
            Shop products
          </Link>
        </div>
      )}
    </main>
  );
}
