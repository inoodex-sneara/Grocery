"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Logo() {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      {!imgError ? (
        <div className="relative h-11 w-36 sm:w-40 flex items-center">
          <Image
            src="/image/logo.avif"
            alt="GROCA Grocery Mart"
            width={160}
            height={44}
            className="object-contain h-full w-auto"
            priority
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Crisp Vector Fallback identical to GROCA design */
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 drop-shadow-sm transition-transform group-hover:scale-105"
            >
              {/* Basket / Cart */}
              <path
                d="M10 18h46l-5.5 24.5a3 3 0 0 1-2.9 2.5H18.4a3 3 0 0 1-2.9-2.5L10 18Z"
                stroke="#74B83E"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#f4faee"
              />
              {/* Wheels */}
              <circle cx="21" cy="52" r="4.5" fill="#74B83E" />
              <circle cx="45" cy="52" r="4.5" fill="#74B83E" />
              {/* Fresh produce inside cart */}
              {/* Tomato */}
              <circle cx="23" cy="22" r="6.5" fill="#EF4444" />
              <path d="M23 15v3m-2-2 4 1" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
              {/* Orange */}
              <circle cx="33" cy="20" r="6" fill="#F97316" />
              <path d="M33 13.5v2.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
              {/* Apple / Lime */}
              <circle cx="42" cy="22" r="6" fill="#84CC16" />
              {/* Veg leaf */}
              <path
                d="M27 12c4-4 12-2 13 4-4 4-10 1-13-4Z"
                fill="#16A34A"
                opacity="0.9"
              />
              <path
                d="M17 14c3-3 8-1 9 3-3 3-7 1-9-3Z"
                fill="#22C55E"
                opacity="0.8"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center tracking-tight font-extrabold text-2xl text-[#74B83E] leading-none">
              <span>GROCA</span>
            </div>
            <span className="text-[10px] tracking-widest font-semibold text-zinc-500 uppercase mt-0.5">
              GROCERY MART
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
