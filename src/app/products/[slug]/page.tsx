import { notFound } from "next/navigation";
import DealProductDetail from "@/components/deals/DealProductDetail";
import { DEAL_PRODUCTS } from "@/data/dealsData";

export const instant = false;

export function generateStaticParams() {
  return DEAL_PRODUCTS.map(({ slug }) => ({ slug }));
}

export default async function DealProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = DEAL_PRODUCTS.find((item) => item.slug === slug);

  if (!product) notFound();

  return <DealProductDetail product={product} />;
}
