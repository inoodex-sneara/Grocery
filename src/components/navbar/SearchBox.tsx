"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

export const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "🛒" },
  { id: "vegetables", name: "Fresh Vegetables", icon: "🥦" },
  { id: "fruits", name: "Fresh Fruits", icon: "🍎" },
  { id: "dairy", name: "Dairy & Eggs", icon: "🥛" },
  { id: "bakery", name: "Bakery & Breads", icon: "🍞" },
  { id: "meat", name: "Fresh Meat & Seafood", icon: "🥩" },
  { id: "beverages", name: "Beverages & Juices", icon: "🧃" },
  { id: "organic", name: "Organic & Healthy", icon: "🌱" },
  { id: "snacks", name: "Snacks & Sweets", icon: "🍪" },
];

export default function SearchBox() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [query, setQuery] = useState("");

  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    alert(`Searching for "${query}" in ${selectedCategory.name}`);
  };

  return (
    <div className="w-full font-lemonada" ref={categoryRef}>
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex h-10 w-full items-center gap-2 sm:h-11"
      >
        {/* Left: Category Dropdown Trigger */}
        <div className="relative h-full shrink-0">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex h-full items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 sm:rounded-[2px] sm:px-4 sm:text-sm"
            aria-expanded={isCategoryOpen}
            title={selectedCategory.name}
          >
            <span className="text-sm sm:text-base">{selectedCategory.icon}</span>
            <span className="truncate max-w-[78px] xs:max-w-[105px] sm:max-w-[150px] md:max-w-none">
              {selectedCategory.name}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                isCategoryOpen ? "rotate-180 text-[#74B83E]" : ""
              }`}
            />
          </button>

          {/* Categories Dropdown List Popover */}
          {isCategoryOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 sm:w-64 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-zinc-100 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="p-2 bg-zinc-50/80 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Select Category
              </div>
              <div className="p-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory.id === cat.id
                        ? "bg-[#74B83E]/10 text-[#74B83E] font-semibold"
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {selectedCategory.id === cat.id && (
                      <Check className="w-4 h-4 text-[#74B83E] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex h-full min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-zinc-200 bg-white transition-colors focus-within:border-[#74B83E] focus-within:ring-2 focus-within:ring-[#74B83E]/15 hover:border-zinc-300 sm:rounded-[2px]">
          {/* Center: Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, fruits, veggies..."
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none sm:px-4 sm:text-sm"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-1 shrink-0 p-1.5 text-zinc-400 hover:text-zinc-600"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Right: Green Search Action Button */}
          <button
            type="submit"
            className="flex h-full shrink-0 items-center justify-center gap-1.5 bg-[#74B83E] px-3.5 text-white transition-colors hover:bg-[#66a336] active:bg-[#588e2e] sm:px-5"
            title="Search"
            aria-label="Search"
          >
            <Search className="h-4 w-4 stroke-[2.2]" />
            <span className="hidden text-xs font-bold md:inline">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
