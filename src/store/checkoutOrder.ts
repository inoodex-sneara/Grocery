import type { CartCurrency, CartItem } from "./cartStore";

export const checkoutPaymentMethods = [
  "bkash",
  "nagad",
  "cod",
  "card",
  "upay",
] as const;

export type CheckoutPaymentMethod = (typeof checkoutPaymentMethods)[number];

export interface CheckoutOrder {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: CartCurrency;
  paymentMethod: CheckoutPaymentMethod;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    address: string;
    apartment: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

const checkoutOrderStorageKey = "groca-checkout-order";

export function subscribeToCheckoutOrder(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function getCheckoutOrderSnapshot() {
  return window.localStorage.getItem(checkoutOrderStorageKey);
}

export function getServerCheckoutOrderSnapshot() {
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCheckoutOrder(value: unknown): value is CheckoutOrder {
  if (!isRecord(value) || !isRecord(value.customer)) return false;

  const { customer } = value;
  const customerFields = [
    "email",
    "firstName",
    "lastName",
    "country",
    "address",
    "apartment",
    "city",
    "postalCode",
    "phone",
  ] as const;

  return (
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    Array.isArray(value.items) &&
    value.items.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        typeof item.image === "string" &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        (item.unit === undefined || typeof item.unit === "string") &&
        (item.currency === "USD" || item.currency === "BDT"),
    ) &&
    typeof value.subtotal === "number" &&
    Number.isFinite(value.subtotal) &&
    typeof value.shipping === "number" &&
    Number.isFinite(value.shipping) &&
    typeof value.total === "number" &&
    Number.isFinite(value.total) &&
    (value.currency === "USD" || value.currency === "BDT") &&
    checkoutPaymentMethods.some((method) => method === value.paymentMethod) &&
    customerFields.every((field) => typeof customer[field] === "string")
  );
}

export function saveCheckoutOrder(order: CheckoutOrder): void {
  window.localStorage.setItem(checkoutOrderStorageKey, JSON.stringify(order));
}

export function parseCheckoutOrder(
  savedOrder: string | null,
): CheckoutOrder | null {
  if (savedOrder === null) return null;

  const parsedOrder: unknown = JSON.parse(savedOrder);
  if (!isCheckoutOrder(parsedOrder)) {
    throw new Error("The saved checkout invoice has an invalid format.");
  }

  return parsedOrder;
}