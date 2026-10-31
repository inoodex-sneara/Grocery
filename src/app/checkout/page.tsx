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
  "h-[48px] w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-[#74b83e] focus:ring-2 focus:ring-[#74b83e]/15";

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
    <main className="min-h-screen bg-white">
      <header className="border-b border-zinc-200">
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
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 md:grid-cols-[1fr_380px] md:gap-16 md:py-12">
          <form
            onSubmit={handleCheckoutSubmit}
            className="space-y-8"
          >
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Contact</h1>
                <a href="#" className="text-sm text-[#54892f] underline">
                  Sign in
                </a>
              </div>
              <input
                className={field}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email or mobile phone number"
                required
              />
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-[#74b83e]" />
                Email me with news and offers
              </label>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">Delivery</h2>
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
              <div className="mt-3 grid grid-cols-2 gap-3">
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
              </div>
              <input
                className={`${field} mt-3`}
                name="address"
                autoComplete="address-line1"
                placeholder="Address"
                required
              />
              <input
                className={`${field} mt-3`}
                name="apartment"
                autoComplete="address-line2"
                placeholder="Apartment, suite, etc. (optional)"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  className={field}
                  name="city"
                  autoComplete="address-level2"
                  placeholder="City"
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
              <input
                className={`${field} mt-3`}
                name="phone"
                autoComplete="tel"
                placeholder="Phone"
                type="tel"
                required
              />
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-[#74b83e]" />
                Save this information for next time
              </label>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold">Shipping method</h2>
              <label className="flex h-[50px] items-center justify-between rounded-lg border border-zinc-900 bg-zinc-50 px-4 text-sm">
                <span>Standard delivery</span>
                <span>{money(shipping, currency)}</span>
              </label>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Payment method</h2>
                <LockKeyhole className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                Choose how you would like to pay.
              </p>
              <fieldset className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <legend className="sr-only">Choose a payment method</legend>
                {paymentMethods.map(
                  ({ id, name, description, Icon, iconUrl }) => {
                  const isSelected = selectedPayment === id;

                  return (
                    <label
                      key={id}
                      className={`flex min-h-[76px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                        isSelected
                          ? "border-[#00b386] bg-[#f3fcf8]"
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
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white">
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt={`${name} logo`}
                            width={28}
                            height={28}
                            unoptimized
                            className="h-7 w-7 rounded-full object-contain"
                          />
                        ) : (
                          <Icon
                            aria-hidden="true"
                            className={`h-5 w-5 ${
                              id === "card"
                                ? "text-indigo-500"
                                : "text-emerald-600"
                            }`}
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {name}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {description}
                        </span>
                      </span>
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 text-[#00a878]"
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
                <div className="mt-4 space-y-3 rounded-xl border border-zinc-200 p-4">
                  <p className="text-sm text-zinc-600">
                    Complete the {paymentMethods.find(
                      (method) => method.id === selectedPayment,
                    )?.name} payment, then enter the mobile number used and its
                    transaction ID.
                  </p>
                  <label className="block text-sm font-medium">
                    Sender mobile number
                    <input
                      className={`${field} mt-2`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="01XXXXXXXXX"
                      value={paymentNumber}
                      onChange={(event) => setPaymentNumber(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Transaction ID (TrxID)
                    <input
                      className={`${field} mt-2`}
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
              <p className="mt-3 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                {paymentNotes[selectedPayment]}
              </p>
            </section>

            <button className="w-full rounded-lg bg-[#83c945] px-6 py-4 font-semibold text-white hover:bg-[#6eaf35]">
              {selectedPayment === "cod" ? "Place order" : "Continue"} ·{" "}
              {money(total, currency)}
            </button>
            {orderSaveError && (
              <p
                role="alert"
                className="text-sm text-red-600"
              >
                {orderSaveError}
              </p>
            )}
            <p className="text-center text-xs text-zinc-400">
              All rights reserved Groca
            </p>
          </form>

          <aside className="order-first h-fit border-b border-zinc-200 pb-7 md:order-none md:border-b-0 md:border-l md:pl-10">
            {items.map((item) => (
              <div key={item.id} className="mb-4 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-xl border border-zinc-200 bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="rounded-xl object-contain p-1"
                  />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-600 text-[11px] text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    {item.unit ?? "Grocery"}
                  </p>
                </div>
                <span className="text-sm">
                  {money(item.price * item.quantity, item.currency)}
                </span>
              </div>
            ))}
            <div className="mt-6 space-y-3 border-t border-zinc-200 pt-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{money(shipping, currency)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{money(total, currency)}</span>
              </div>
            </div>
            <Link
              href="/cart"
              className="mt-6 inline-block text-sm text-[#54892f] underline"
            >
              Return to cart
            </Link>
          </aside>
        </div>
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
