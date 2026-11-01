import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/components/products/ProductDetail";
import DealProductDetail from "@/components/deals/DealProductDetail";
import { PRODUCTS, getProductBySlug } from "@/data/productsData";
import { DEAL_PRODUCTS } from "@/data/dealsData";

export const instant = false;

export function generateStaticParams() {
  const productSlugs = PRODUCTS.map(({ slug }) => ({ slug }));
  const dealSlugs = DEAL_PRODUCTS.map(({ slug }) => ({ slug }));
  return [...productSlugs, ...dealSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const standardProduct = getProductBySlug(slug);
  if (standardProduct) {
    return {
      title: `${standardProduct.name} - Groca Grocery Mart`,
      description: standardProduct.description,
    };
  }

  const dealProduct = DEAL_PRODUCTS.find((item) => item.slug === slug);
  if (dealProduct) {
    return {
      title: `${dealProduct.name} - Groca Deals`,
      description: `Shop ${dealProduct.name} at special deal price.`,
    };
  }

  return {
    title: "Product Not Found - Groca",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Check in primary store products
  const standardProduct = getProductBySlug(slug);
  if (standardProduct) {
    return <ProductDetail product={standardProduct} />;
  }

  // 2. Check in deal products
  const dealProduct = DEAL_PRODUCTS.find((item) => item.slug === slug);
  if (dealProduct) {
    return <DealProductDetail product={dealProduct} />;
  }

  notFound();
}
