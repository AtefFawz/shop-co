"use client";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const currentSearch = searchParams.get("keyword") || "";

    if (query === currentSearch) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("keyword", query);
      } else {
        params.delete("keyword");
      }

      // const targetPath = pathname.includes("/shopping") ? pathname : "/";
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, pathname, searchParams]);
  return (
    <div className="relative w-full  group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black">
        <Search size={18} />
      </div>

      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-10 text-sm focus:ring-2 focus:ring-black outline-none"
      />

      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-black"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
