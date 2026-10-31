"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar, Tag, MessageSquare } from "lucide-react";
import { BlogPost } from "@/data/blogData";

interface CommentItem {
  id: string;
  name: string;
  date: string;
  text: string;
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: "comment-1",
    name: "Rayden",
    date: "February 17, 2021",
    text: "Tortor at risus viverra adipiscing at. Sit amet facilisis magna etiam tempor orci. Duis ut diam quam nulla. Ut placerat orci nulla pellentesque. At elementum eu facilisis sed odio.",
  },
];

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const [commentAdded, setCommentAdded] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title: post.title,
            text: post.excerpt,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newCommentItem: CommentItem = {
      id: "comment-" + Date.now(),
      name: name.trim(),
      date: today,
      text: commentText.trim(),
    };

    setComments((prev) => [...prev, newCommentItem]);
    setName("");
    setEmail("");
    setCommentText("");
    setCommentAdded(true);
    setTimeout(() => setCommentAdded(false), 3000);
  };

  return (
    <div className="w-full flex-1 bg-white min-h-screen py-6 sm:py-10 md:py-12">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* =========================================
            1. HERO THUMBNAIL IMAGE (Responsive aspect ratio)
           ========================================= */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-100 shadow-xs mb-5 sm:mb-7 md:mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
            className="object-cover"
          />
        </div>

        {/* =========================================
            2. ARTICLE TITLE (Responsive typography)
           ========================================= */}
        <h1 className="text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-bold italic text-zinc-900 tracking-tight leading-snug sm:leading-snug mb-3 break-words">
          {post.title}
        </h1>

        {/* =========================================
            3. META BAR (Mobile wrapped & tablet/desktop inline)
           ========================================= */}
        <div className="flex items-center flex-wrap gap-x-2.5 sm:gap-x-3 gap-y-1.5 sm:gap-y-2 text-xs sm:text-[13px] text-zinc-600 mb-4 sm:mb-5">
          {/* Author */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <User className="w-3.5 h-3.5 text-[#74B83E] stroke-[2.2]" />
            <span>{post.author}</span>
          </div>

          <span className="text-zinc-300 select-none">|</span>

          {/* Date */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#74B83E] stroke-[2.2]" />
            <span>{post.date}</span>
          </div>

          <span className="text-zinc-300 select-none">|</span>

          {/* Tags */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <Tag className="w-3.5 h-3.5 text-[#74B83E] stroke-[2.2]" />
            <span>{post.tags}</span>
          </div>

          <span className="text-zinc-300 select-none">|</span>

          {/* Comments count */}
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-[#74B83E] stroke-[2.2]" />
            <span>
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* =========================================
            4. SHARE BUTTON (Touch-friendly tap target)
           ========================================= */}
        <div className="mb-5 sm:mb-6">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share article"
            className="inline-flex items-center gap-1.5 py-1 text-xs sm:text-sm font-semibold text-[#74B83E] hover:text-[#619c31] active:scale-95 transition-all cursor-pointer group"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-[#74B83E] group-hover:-translate-y-0.5 transition-transform"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>

        {/* =========================================
            5. ARTICLE BODY TEXT & QUOTE
           ========================================= */}
        <div className="space-y-4 sm:space-y-5 text-xs sm:text-[14px] text-zinc-600 leading-relaxed font-normal">
          {/* Paragraph 1 */}
          {post.paragraphs[0] && <p>{post.paragraphs[0]}</p>}

          {/* Editorial Highlight Quote */}
          {post.quote && (
            <p className="my-5 sm:my-7 text-sm sm:text-[15px] font-bold italic text-zinc-900 leading-relaxed sm:leading-loose pl-1">
              {post.quote}
            </p>
          )}

          {/* Remaining Paragraphs */}
          {post.paragraphs.slice(1).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* =========================================
            6. BACK TO BLOG NAVIGATION (Centered Link)
           ========================================= */}
        <div className="text-center my-8 sm:my-12 md:my-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 py-2 text-xs sm:text-sm font-semibold text-[#74B83E] hover:underline active:scale-95 transition-all"
          >
            <span>&larr; Back to blog</span>
          </Link>
        </div>

        {/* =========================================
            7. COMMENTS SECTION CONTAINER (Responsive Padding)
           ========================================= */}
        <section className="bg-[#f8f9fa] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10 border border-zinc-100 shadow-2xs">
          {/* Comments Heading */}
          <h2 className="text-base sm:text-lg md:text-xl font-bold italic text-zinc-900 mb-4 sm:mb-5">
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </h2>

          {/* Comments List */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 md:mb-10">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-2xs"
              >
                <p className="text-xs sm:text-[13.5px] text-zinc-600 leading-relaxed font-normal mb-3">
                  {comment.text}
                </p>
                <div className="text-right text-[11px] sm:text-xs text-zinc-500 font-medium">
                  <span>{comment.name}</span>
                  <span className="mx-1.5 text-zinc-300">|</span>
                  <span>{comment.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Leave A Comment Heading */}
          <h2 className="text-base sm:text-lg md:text-xl font-bold italic text-zinc-900 mb-4 sm:mb-5">
            Leave A Comment
          </h2>

          {/* Form */}
          <form onSubmit={handlePostComment} className="space-y-3.5 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                required
                placeholder="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#74B83E] transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#74B83E] transition-colors"
              />
            </div>

            <textarea
              required
              rows={4}
              placeholder="Comment *"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#74B83E] transition-colors resize-none"
            />

            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-7 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#74B83E] hover:bg-[#639f33] active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all cursor-pointer text-center"
              >
                Post Comment
              </button>

              {commentAdded && (
                <span className="text-xs font-semibold text-emerald-600 text-center sm:text-right">
                  Comment posted successfully!
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
