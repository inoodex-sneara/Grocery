"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    text: "I don't like ghee, but my father really loves it. So I bought some ghee for him. He said this ghee is the best he has ever had",
    author: "Shahria Khan Abir",
    role: "Service Holder",
    avatar: "SK",
    rating: 5,
  },
  {
    id: 2,
    text: "এটি অভিজ্ঞতার গুণগত মানের উপর আমার বিশ্বাস বাড়িয়ে দিয়েছে। খাবার খাওয়ার আগে থেকেই মনে হয়েছে, এগুলো সত্যিই উন্নত মানের।",
    author: "Fariha Akter Tumpa",
    role: "Entrepreneur",
    avatar: "FA",
    rating: 5,
  },
  {
    id: 3,
    text: "আমি আমার পরিবারকে এই খাবারগুলো দিয়ে খাওয়াই। প্রতিবারই তাদের ভেতর থেকে বিশেষ প্রশংসা পাই।",
    author: "Ayesha Khan",
    role: "Banker",
    avatar: "AK",
    rating: 5,
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const nextReview = () => setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  const prevReview = () => setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

  const visibleReviews = Array.from({ length: 3 }, (_, index) => REVIEWS[(activeIndex + index) % REVIEWS.length]);

  return (
    <section className="w-full py-4 sm:py-8">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {visibleReviews.map((review, index) => (
            <article
              key={`${review.id}-${index}`}
              className="flex min-h-[260px] flex-col justify-between rounded-[22px] border border-[#e7e7e7] bg-[#f5f5f3] p-5 sm:p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-700 ease-out"
              style={{
                transform: index === 0 ? "translateY(0px)" : "translateY(0px)",
                opacity: 1,
              }}
            >
              <p className="text-base leading-8 text-zinc-700 sm:text-[18px] sm:leading-9">
                {review.text}
              </p>

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-1 text-[#f7a800]">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <Star key={`${review.id}-star-${starIndex}`} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d5d5d5] to-[#bfbfbf] text-sm font-bold text-[#1f1f1f]">
                    {review.avatar}
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-zinc-800">{review.author}</h3>
                    <p className="text-sm text-zinc-500">{review.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prevReview}
            aria-label="Previous review"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0b05f] bg-[#fff7ef] text-[#f28a00] transition hover:scale-105 hover:bg-[#fff0df]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {REVIEWS.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to review ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-8 bg-[#f28a00]" : "w-2.5 bg-[#f3d3a8]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextReview}
            aria-label="Next review"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0b05f] bg-[#fff7ef] text-[#f28a00] transition hover:scale-105 hover:bg-[#fff0df]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
