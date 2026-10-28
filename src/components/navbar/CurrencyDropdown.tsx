"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  flagNode: ReactNode;
  rate: number;
}

export const AlgeriaFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 640 480">
    <path fill="#006633" d="M0 0h320v480H0z" />
    <path fill="#fff" d="M320 0h320v480H320z" />
    <path
      fill="#d21034"
      d="M370.8 240a96 96 0 1 1-177.3-51.5 120 120 0 1 0 0 103 96 96 0 0 1 177.3-51.5zm-5.8 0-41.2-13.4 25.5 35.1v-43.4l-25.5 35.1z"
    />
  </svg>
);

export const USAFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 640 480">
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
    <path fill="#192f5d" d="M0 0h260v260H0z" />
  </svg>
);

export const EUFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 640 480">
    <path fill="#039" d="M0 0h640v480H0z" />
    <circle cx="320" cy="240" r="120" stroke="#fc0" strokeWidth="12" strokeDasharray="1 50" fill="none" />
  </svg>
);

export const BDFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 640 480">
    <path fill="#006a4e" d="M0 0h640v480H0z" />
    <circle cx="280" cy="240" r="130" fill="#f42a41" />
  </svg>
);

export const UKFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="60" d="m0 0 640 480m0-480L0 480M320 0v480M0 240h640" />
    <path stroke="#c8102e" strokeWidth="36" d="M320 0v480M0 240h640" />
  </svg>
);

export const currencies: CurrencyItem[] = [
  {
    code: "DZ",
    name: "Algerian Dinar",
    symbol: "DA",
    flagNode: <AlgeriaFlag />,
    rate: 134.5,
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flagNode: <USAFlag />,
    rate: 1.0,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flagNode: <EUFlag />,
    rate: 0.92,
  },
  {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    flagNode: <BDFlag />,
    rate: 118.0,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flagNode: <UKFlag />,
    rate: 0.78,
  },
];

export default function CurrencyDropdown() {
  const [selected, setSelected] = useState<CurrencyItem>(currencies[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-[#74B83E] transition-colors py-1 px-1.5 rounded focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-bold leading-none">{selected.code}</span>
        <span className="flex items-center">{selected.flagNode}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#74B83E]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-zinc-100 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="py-1">
            {currencies.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer ${
                  selected.code === item.code
                    ? "font-bold text-[#74B83E] bg-[#74B83E]/5"
                    : "text-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item.flagNode}</span>
                  <span className="font-semibold">{item.code}</span>
                  <span className="text-zinc-400">({item.symbol})</span>
                </div>
                {selected.code === item.code && <Check className="w-3.5 h-3.5 text-[#74B83E]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
