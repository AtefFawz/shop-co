"use client";

import { Search, X, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // استخراج الكلمة الحالية من الـ URL (سواء كانت keyword أو search)
  const currentKeyword =
    searchParams.get("keyword") || searchParams.get("search") || "";
  const [query, setQuery] = useState(currentKeyword);

  // تحديث حالة الـ input لو الـ URL تغير من مكان تاني في التطبيق
  useEffect(() => {
    setQuery(currentKeyword);
  }, [currentKeyword]);

  // تنفيذ البحث عند الضغط على Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch(query);
    }
  };

  // دالة تنفيذ البحث وتحديث الـ URL بدون إعادة تحميل الصفحة بالكامل
  const executeSearch = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      params.set("keyword", trimmedQuery);
    } else {
      params.delete("keyword");
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // مسح نص البحث
  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("keyword");
    params.delete("search");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative w-full group">
      {/* أيقونة البحث على اليسار */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 transition-colors group-focus-within:text-black">
        <Search size={17} />
      </div>

      {/* حقل الإدخال */}
      <input
        type="text"
        placeholder="Search for products, brands..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-neutral-100/90 border border-transparent rounded-full py-2.5 pl-11 pr-20 text-xs sm:text-sm font-medium text-black placeholder:text-neutral-400 outline-none transition-all duration-200 focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5"
      />

      {/* أزرار الإجراءات على اليمين (زر مسح + زر Enter تفاعلي) */}
      <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear search"
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200/70 hover:text-black cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        )}

        {/* زر تنفيذ البحث بالضغط المباشر */}
        <button
          type="button"
          onClick={() => executeSearch(query)}
          title="Press to search"
          disabled={isPending}
          className="flex h-7 px-2.5 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 cursor-pointer transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wider"
        >
          {isPending ? (
            <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
          ) : (
            <span className="flex items-center gap-1">
              <span>Go</span>
              <ArrowRight size={11} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
