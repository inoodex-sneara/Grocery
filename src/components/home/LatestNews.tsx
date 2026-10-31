"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Calendar } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogData";

export default function LatestNews() {
  return (
    <section className="w-full py-10 sm:py-14">
      {/* =========================================
          SECTION HEADER WITH DELICATE LEAF WATERMARK
         ========================================= */}
      <div className="relative text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-4">
        {/* Soft Organic Leaf Branch Watermark in the background */}
        <div className="absolute left-1/2 -top-5 -translate-x-1/2 -z-0 pointer-events-none opacity-40 select-none">
          <svg
            className="w-24 sm:w-28 h-12 sm:h-14 text-[#74B83E]"
            viewBox="0 0 120 60"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main stem */}
            <path
              d="M10 50 C40 45, 80 30, 110 10"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Top leaf */}
            <path
              d="M110 10 C100 2, 85 5, 82 18 C95 18, 105 14, 110 10 Z"
              opacity="0.9"
            />
            {/* Middle left leaf */}
            <path
              d="M75 25 C65 14, 48 18, 46 30 C58 31, 70 28, 75 25 Z"
              opacity="0.85"
            />
            {/* Middle right leaf */}
            <path
              d="M85 22 C92 32, 105 32, 106 22 C98 18, 88 18, 85 22 Z"
              opacity="0.8"
            />
            {/* Lower leaf */}
            <path
              d="M45 38 C35 28, 22 32, 20 42 C32 44, 40 40, 45 38 Z"
              opacity="0.75"
            />
          </svg>
        </div>

        {/* Section Title in Lemonada organic font */}
        <h2 className="relative z-10 text-2xl sm:text-3xl md:text-[36px] font-bold text-[#74B83E] tracking-tight font-lemonada">
          Latest News
        </h2>

        {/* Section Subtitle */}
        <p className="relative z-10 text-xs sm:text-sm text-zinc-500 font-normal mt-2 leading-relaxed">
          Est ante in nibh mauris cursus donec enim diam
        </p>
      </div>

      {/* =========================================
          3-COLUMN BLOG CARD GRID (Mobile, Tablet, Laptop, Desktop)
         ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col justify-between transition-all duration-300"
          >
            <div>
              {/* Card Thumbnail Image with Link */}
              <Link
                href={`/blog/${post.slug}`}
                className="relative block w-full aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-100 shadow-xs group-hover:shadow-md transition-shadow duration-300"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </Link>

              {/* Meta Info: Author & Date */}
              <div className="flex items-center flex-wrap gap-2 mt-4 sm:mt-5 mb-2.5 sm:mb-3 text-xs sm:text-[13px] text-zinc-600">
                {/* Author with circular user icon */}
                <div className="flex items-center gap-1.5 font-medium shrink-0">
                  <User className="w-4 h-4 text-[#74B83E] stroke-[2.2]" />
                  <span>{post.author}</span>
                </div>

                {/* Divider Pipe */}
                <span className="text-zinc-300 select-none">|</span>

                {/* Date with calendar icon */}
                <div className="flex items-center gap-1.5 font-medium shrink-0">
                  <Calendar className="w-4 h-4 text-[#74B83E] stroke-[2.2]" />
                  <span>{post.date}</span>
                </div>
              </div>

              {/* Blog Title (Bold & Italic styled as in design) */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold italic text-zinc-900 group-hover:text-[#74B83E] transition-colors duration-200 leading-snug mb-2.5 sm:mb-3">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt Paragraph */}
              <p className="text-xs sm:text-[13.5px] text-zinc-600 leading-relaxed font-normal line-clamp-3 sm:line-clamp-4">
                {post.excerpt}
              </p>
            </div>

            {/* Read More Pill Button with Link */}
            <div className="mt-4 sm:mt-6 pt-1">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center justify-center px-6 sm:px-7 py-2 sm:py-2.5 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
