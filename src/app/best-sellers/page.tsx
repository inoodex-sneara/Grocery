import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Leaf, Sparkles, Star } from "lucide-react";
import { PRODUCTS } from "@/data/productsData";

const bestSellers = [...PRODUCTS].sort((a, b) => b.viewCount - a.viewCount);

export default function BestSellersPage() {
  return (
    <main className="min-h-screen bg-[#fbfcf8]">
      <section className="relative isolate overflow-hidden bg-[#f1f8e9]">
        <div className="absolute -right-24 -top-36 -z-10 h-96 w-96 rounded-full bg-[#dff0cc] blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 -z-10 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e9c9] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-[#54892f]"><Sparkles className="h-4 w-4" />Customer favorites</span>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight text-[#18351e] sm:text-5xl lg:text-6xl">Good food.<br/><span className="text-[#74b83e]">Loved every day.</span></h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600">Meet the fresh picks our shoppers keep coming back for, sourced with care and ready for your table.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#popular-picks" className="inline-flex items-center gap-2 rounded-full bg-[#74b83e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[#639f33]">Explore best sellers <ArrowRight className="h-4 w-4" /></a>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600"><Leaf className="h-4 w-4 text-[#74b83e]"/>Fresh picks, thoughtfully chosen</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-8 rounded-full bg-[#dceecb] blur-2xl" />
            <div className="relative grid grid-cols-2 gap-3">
              {bestSellers.slice(0,4).map((product,index)=>(<div key={product.slug} className={`group relative aspect-square overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-3 shadow-[0_18px_45px_-28px_rgba(24,53,30,.38)] transition duration-300 hover:-translate-y-1 ${index===1||index===2?"mt-7":""}`}>
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 40vw, 220px" className="object-contain p-4 transition duration-500 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#24432a] shadow-sm">{product.name}</span>
              </div>))}
            </div>
          </div>
        </div>
      </section>

      <section id="popular-picks" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#74b83e]">Picked by our community</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18351e] sm:text-4xl">Best sellers</h2><p className="mt-2 text-sm text-zinc-500">The fresh favorites worth making room for.</p></div>
          <span className="w-fit rounded-full border border-[#e5ebdf] bg-white px-4 py-2 text-sm font-semibold text-zinc-600">{bestSellers.length} shopper favorites</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {bestSellers.map((product,index)=>(<article key={product.slug} className="group overflow-hidden rounded-[1.5rem] border border-[#e9eee4] bg-white shadow-[0_10px_35px_-28px_rgba(24,53,30,.3)] transition duration-300 hover:-translate-y-1 hover:border-[#cfe3bf] hover:shadow-[0_22px_45px_-28px_rgba(24,53,30,.3)]">
            <div className="relative m-2.5 aspect-square overflow-hidden rounded-[1.1rem] bg-[#f5f8f1] sm:m-3">
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#477b2e] shadow-sm"><BadgeCheck className="h-3.5 w-3.5"/>{index<3?"Top pick":"Fresh pick"}</div>
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px" className="object-contain p-5 transition duration-500 group-hover:scale-105 sm:p-7" />
              <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-zinc-600 shadow-sm">{product.type}</span>
            </div>
            <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-1 text-amber-400"><Star className="h-3.5 w-3.5 fill-current"/><span className="text-xs font-bold text-zinc-700">{product.rating.toFixed(1)}</span></div><span className="text-[11px] text-zinc-400">{product.reviewCount} reviews</span></div>
              <h3 className="mt-2 truncate text-base font-extrabold text-[#203b25] sm:text-lg">{product.name}</h3>
              <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-zinc-500">{product.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3"><div className="flex items-baseline gap-2"><span className="text-lg font-black text-[#5b9e31]">${product.price.toFixed(2)}</span>{product.originalPrice&&<span className="text-xs text-zinc-400 line-through">${product.originalPrice.toFixed(2)}</span>}</div><Link href="/shop" className="inline-flex items-center gap-1 rounded-full bg-[#74b83e] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#639f33] sm:px-4">Shop <ArrowRight className="h-3.5 w-3.5"/></Link></div>
            </div>
          </article>))}
        </div>
      </section>
      <section className="mx-5 mb-14 rounded-[1.5rem] bg-[#1d3b24] px-6 py-8 text-center text-white sm:mx-8 sm:mb-20 sm:py-10"><p className="text-lg font-bold">Your next favorite is waiting.</p><p className="mt-1 text-sm text-white/70">Browse the full range of fresh groceries.</p><Link href="/shop" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#315a2a] transition hover:bg-[#eef7e7]">Shop all products <ArrowRight className="h-4 w-4"/></Link></section>
    </main>
  );
}
