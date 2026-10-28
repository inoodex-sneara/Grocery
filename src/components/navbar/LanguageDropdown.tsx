"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface LanguageItem {
  code: string;
  name: string;
  localName: string;
}

export const languages: LanguageItem[] = [
  { code: "en", name: "English", localName: "English" },
  { code: "fr", name: "French", localName: "Français" },
  { code: "ar", name: "Arabic", localName: "العربية" },
  { code: "bn", name: "Bangla", localName: "বাংলা" },
  { code: "es", name: "Spanish", localName: "Español" },
];

export default function LanguageDropdown() {
  const [selected, setSelected] = useState<LanguageItem>(languages[0]);
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
        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-[#74B83E] transition-colors py-1 px-1.5 rounded focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <span>{selected.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#74B83E]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-zinc-100 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="py-1">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                  selected.code === item.code
                    ? "font-bold text-[#74B83E] bg-[#74B83E]/5"
                    : "text-zinc-700"
                }`}
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-[10px] text-zinc-400">{item.localName}</div>
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
