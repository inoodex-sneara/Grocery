import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Filter } from "lucide-react";

export default function ShopPage() {
  const products = [
    {
      id: "1",
      name: "Fresh Cauliflower (Fulcopy)",
      category: "Fresh Vegetables",
      price: "$2.99",
      image: "/products/65fa976ad61902ef2307cefc_Cauliflower-Fulcopy_1.webp",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Kacha Morich (Green Chilli)",
      category: "Spices & Veg",
      price: "$1.49",
      image: "/products/668d1a336465c458a3e0fda7_Kacha-Morich-Chilli-Green_1.webp",
      rating: 4.9,
    },
    {
      id: "3",
      name: "Fresh Catch River Fish",
      category: "Fresh Seafood",
      price: "$9.50",
      image: "/products/Banner_Fresh fish_D.jpeg",
      rating: 5.0,
    },
    {
      id: "4",
      name: "Premium Lean Beef Cut",
      category: "Fresh Meat",
      price: "$14.20",
      image: "/products/bannaer_Fresh meat_D.jpeg",
      rating: 4.9,
    },
  ];

  return (
    <div className="flex-1 bg-zinc-50/50 py-8">
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Breadcrumb & Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              All Grocery Products
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Showing fresh farm produce, groceries, and daily essentials
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-2 bg-white border border-zinc-200 rounded-md text-xs font-semibold text-zinc-700 flex items-center gap-1.5 shadow-2xs hover:bg-zinc-50">
              <Filter className="w-3.5 h-3.5 text-[#74B83E]" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-zinc-200/80 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg hover:border-[#74B83E]/40 transition-all duration-300 group"
            >
              <div className="relative h-44 w-full flex items-center justify-center p-2 mb-3 bg-zinc-50 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#74B83E]">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-base font-extrabold text-zinc-900">
                    {item.price}
                  </span>
                  <button className="p-2 rounded-lg bg-[#74B83E] text-white hover:bg-[#68a62f] transition-colors cursor-pointer shadow-xs">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
