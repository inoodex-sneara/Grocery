"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Printer,
  ShoppingBag,
} from "lucide-react";
import {
  getCheckoutOrderSnapshot,
  getServerCheckoutOrderSnapshot,
  parseCheckoutOrder,
  subscribeToCheckoutOrder,
} from "@/store/checkoutOrder";

const money = (amount: number, currency: "USD" | "BDT") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

const paymentNames = {
  bkash: "bKash",
  nagad: "Nagad",
  cod: "Cash on Delivery",
  card: "Card",
  upay: "Upay",
} as const;

export default function ConfirmationPage() {
  const savedOrder = useSyncExternalStore(
    subscribeToCheckoutOrder,
    getCheckoutOrderSnapshot,
    getServerCheckoutOrderSnapshot,
  );
  const { order, loadError } = useMemo(() => {
    try {
      return { order: parseCheckoutOrder(savedOrder), loadError: false };
    } catch {
      return { order: null, loadError: true };
    }
  }, [savedOrder]);

  if (loadError || !order) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[#f7f9f4] px-4 py-20">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#203b25]">
            {loadError ? "Unable to load your invoice" : "No invoice found"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {loadError
              ? "Please try again or return to checkout."
              : "Place an order to view its invoice here."}
          </p>
          <Link
            href={loadError ? "/checkout" : "/shop"}
            className="mt-6 inline-flex rounded-full bg-[#74b83e] px-6 py-3 text-sm font-semibold text-white"
          >
            {loadError ? "Return to checkout" : "Shop groceries"}
          </Link>
        </div>
      </main>
    );
  }

  const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
  const paymentStatus =
    order.paymentMethod === "cod"
      ? "Due on delivery"
      : "Submitted · payment verification pending";

  return (
    <main className="flex-1 bg-[#f7f9f4] px-4 py-10 sm:px-8 sm:py-14 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-[#54892f]"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-[#74b83e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#639f33]"
          >
            <Printer className="h-4 w-4" />
            Print invoice
          </button>
        </div>

        <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <header className="border-b border-zinc-200 p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <Link
                  href="/"
                  className="font-lemonada text-3xl font-extrabold tracking-wide text-[#74b83e]"
                >
                  GROCA
                  <span className="block text-[10px] leading-none tracking-widest text-zinc-500">
                    GROCERY MART
                  </span>
                </Link>
                <p className="mt-5 text-sm text-zinc-500">
                  Invoice for your grocery order
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Invoice
                </p>
                <p className="mt-1 text-lg font-bold text-zinc-900">
                  {order.id}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-semibold">Your order has been received</p>
                <p className="mt-0.5 text-sm">
                  Keep this invoice for your records.
                </p>
              </div>
            </div>
          </header>

          <section className="grid gap-8 border-b border-zinc-200 p-6 sm:grid-cols-2 sm:p-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Billed to
              </h2>
              <p className="mt-3 font-semibold text-zinc-900">{customerName}</p>
              <p className="mt-1 text-sm text-zinc-600">{order.customer.email}</p>
              <p className="mt-1 text-sm text-zinc-600">{order.customer.phone}</p>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Delivery address
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                {customerName}
                <br />
                {order.customer.address}
                {order.customer.apartment && (
                  <>
                    <br />
                    {order.customer.apartment}
                  </>
                )}
                <br />
                {order.customer.city}, {order.customer.postalCode}
                <br />
                {order.customer.country}
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#74b83e]" />
              <h2 className="font-bold text-zinc-900">Order items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-y border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="py-3 pr-4 font-semibold">Product</th>
                    <th className="px-4 py-3 text-right font-semibold">Price</th>
                    <th className="px-4 py-3 text-right font-semibold">Qty</th>
                    <th className="py-3 pl-4 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 rounded-lg bg-zinc-50">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900">
                              {item.name}
                            </p>
                            {item.unit && (
                              <p className="mt-0.5 text-xs text-zinc-500">
                                {item.unit}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-zinc-600">
                        {money(item.price, item.currency)}
                      </td>
                      <td className="px-4 py-4 text-right text-zinc-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 pl-4 text-right font-semibold text-zinc-900">
                        {money(item.price * item.quantity, item.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-zinc-600">
                <span>Subtotal</span>
                <span>{money(order.subtotal, order.currency)}</span>
              </div>
              <div className="flex justify-between gap-4 text-zinc-600">
                <span>Shipping</span>
                <span>{money(order.shipping, order.currency)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-zinc-200 pt-4 text-base font-bold text-zinc-900">
                <span>Total</span>
                <span>{money(order.total, order.currency)}</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-xl bg-zinc-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Payment method
                </p>
                <p className="mt-1 font-medium text-zinc-800">
                  {paymentNames[order.paymentMethod]}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Payment status
                </p>
                <p className="mt-1 font-medium text-zinc-800">{paymentStatus}</p>
              </div>
            </div>
            {order.paymentMethod !== "cod" && (
              <p className="mt-3 text-xs leading-5 text-zinc-500">
                Online payment processing is not connected yet. Your payment
                details have not been verified by the store.
              </p>
            )}
          </section>
        </article>
      </div>
    </main>
  );
}
