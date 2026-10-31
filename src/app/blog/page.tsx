import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar, ArrowRight, ChevronRight, BookOpen } from "lucide-react";
import { getAllBlogPosts } from "@/data/blogData";

export const metadata: Metadata = {
  title: "Blog & Health News - Groca Grocery Store",
  description:
    "Read the latest nutritional tips, organic recipes, and grocery guidelines from Groca experts.",
};

export default function BlogListingPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="flex-1 bg-zinc-50/60 min-h-screen py-8 sm:py-12">
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 mb-8"
        >
          <Link
            href="/"
            className="hover:text-[#74B83E] transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-800 font-semibold">Latest News &amp; Blog</span>
        </nav>

        {/* Section Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-12 sm:mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#74B83E]/10 text-[#74B83E] text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Groca Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#74B83E] font-lemonada tracking-tight mb-3">
            Latest News &amp; Articles
          </h1>
          <p className="text-sm text-zinc-600 max-w-lg mx-auto">
            Est ante in nibh mauris cursus donec enim diam. Discover healthy living tips, organic harvest guides, and delicious recipes.
          </p>
        </div>

        {/* 3-Column Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Thumbnail */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block w-full aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 shadow-xs"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#74B83E] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {post.category}
                  </span>
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-2 mt-5 mb-3 text-xs sm:text-[13px] text-zinc-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4 text-[#74B83E] stroke-[2.2]" />
                    <span>{post.author}</span>
                  </div>
                  <span className="text-zinc-300">|</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-[#74B83E] stroke-[2.2]" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold italic text-zinc-900 group-hover:text-[#74B83E] transition-colors duration-200 leading-snug mb-3">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-xs sm:text-[13.5px] text-zinc-600 leading-relaxed font-normal line-clamp-4">
                  {post.excerpt}
                </p>
              </div>

              {/* Read More Button */}
              <div className="mt-6 pt-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

