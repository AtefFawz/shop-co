"use client";
import { useEffect } from "react";
import Card from "@/components/common/Card";
import { Menu } from "./menu/Menu";
import { ShopPaths } from "./Paths";
import MobileFilterDrawer from "./MenuPhone/MeuPhone";
import { useFilterStore } from "@/store/filterStore";
import { Product } from "@/types/index";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import { PackageSearch } from "lucide-react";
import useData from "@/hooks/getData";
import { Pagination } from "../Pagination.client";
import { useSearchParams } from "next/navigation";

export const Shop = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { data, loading, page, totalPages, goToPage } = useData("/product", {
    params: {
      keyword: keyword,
    },
  });
  const setInitialProducts = useFilterStore((s) => s.setInitialProducts);
  const displayProducts = useFilterStore((s) => s.filteredProducts);
  const type = useFilterStore((s) => s.currentType);
  const section = useFilterStore((s) => s.currentSection);

  useEffect(() => {
    if (data?.data?.Products) {
      setInitialProducts(data.data.Products);
    }
  }, [data, setInitialProducts]);

  return (
    <section className="min-h-screen bg-[#F8F8F8]">
      <div className="container mx-auto px-3 sm:px-6 py-8 sm:py-10">
        {/* ── Desktop breadcrumb ── */}
        <p className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
          <span>Shop</span>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">{type || "All Products"}</span>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">{section || "All Sections"}</span>
        </p>

        <div className="flex gap-6 items-start">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:block sticky top-6 h-fit w-[260px] xl:w-[280px] shrink-0 self-start">
            <Menu />
          </aside>

          {/* ── Products area ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Mobile filter bar */}
            <div className="md:hidden">
              <MobileFilterDrawer />
            </div>

            {/* Results count */}
            {!loading && (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {displayProducts.length} product
                {displayProducts.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {displayProducts.map((e: Product) => (
                  <Card product={e} key={e._id} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <PackageSearch size={24} className="text-gray-300" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-300">
                  No products found
                </p>
              </div>
            )}
            <Pagination
              page={page}
              goToPage={goToPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>

      <ShopPaths />
    </section>
  );
};
