"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-md sm:rounded-lg bg-[#74B83E] hover:bg-[#639f33] text-white flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-75"
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
    </button>
  );
}

