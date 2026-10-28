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
    <div className="w-full" ref={categoryRef}>
      <form
        onSubmit={handleSearchSubmit}
        className="w-full flex items-center h-10 sm:h-11 bg-white border border-zinc-200/90 hover:border-zinc-300 focus-within:border-[#74B83E] focus-within:ring-2 focus-within:ring-[#74B83E]/15 rounded-lg sm:rounded-[2px] transition-all shadow-2xs relative"
      >
        {/* Left: Category Dropdown Trigger */}
        <div className="relative shrink-0 h-full">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="h-full px-2.5 sm:px-4 bg-zinc-50/70 hover:bg-zinc-100/70 border-r border-zinc-200/80 text-xs sm:text-sm font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer select-none rounded-l-lg sm:rounded-l-[2px]"
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

        {/* Center: Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, fruits, veggies..."
          className="flex-1 h-full px-3 sm:px-4 text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 bg-transparent focus:outline-none min-w-0"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 cursor-pointer mr-1 shrink-0"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right: Green Search Action Button */}
        <button
          type="submit"
          className="h-full px-3.5 sm:px-5 bg-[#74B83E] hover:bg-[#66a336] active:bg-[#588e2e] text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 rounded-r-lg sm:rounded-r-[2px]"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span className="hidden md:inline text-xs font-bold">Search</span>
        </button>
      </form>
    </div>
  );
}
