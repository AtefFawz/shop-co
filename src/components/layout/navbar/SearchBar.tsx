"use client";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentKeyword =
    searchParams.get("keyword") || searchParams.get("search") || "";
  const [query, setQuery] = useState(currentKeyword);

  useEffect(() => {
    setQuery(currentKeyword);
  }, [currentKeyword]);

  useEffect(() => {
    if (query === currentKeyword) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("keyword", query.trim());
      } else {
        params.delete("keyword");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("keyword");
    params.delete("search");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-800">
        <Search size={18} />
      </div>

      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-10 text-sm focus:ring-2 focus:ring-gray-600 outline-none"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-black cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
