"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";

import Card from "@/components/common/Card";
import { Menu } from "./menu/Menu";
import { ShopPaths } from "./Paths";
import MobileFilterDrawer from "./MenuPhone/MeuPhone";
import { Pagination } from "@/components/common/Pagination.client";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";

import { useFilterStore } from "@/store/filterStore";
import { Product } from "@/types/index";
import useData from "@/hooks/getData";

export const Shop = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() || "";

  const { data, loading, page, totalPages, goToPage } = useData("/product", {
    params: {
      keyword,
    },
  });

  const {
    currentType,
    currentSection,
    currentStyle,
    setInitialProducts,
    filteredProducts: displayProducts,
  } = useFilterStore((state) => state);

  useEffect(() => {
    const products = data?.data?.Products;

    if (products) {
      setInitialProducts(products);
    }
  }, [data, setInitialProducts]);

  const hasProducts = displayProducts.length > 0;

  return (
    <section className="min-h-screen bg-[#F8F8F8]">
      <div className="Responsive">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6  items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 md:flex"
        >
          <span>Shop</span>
          <span aria-hidden="true" className="text-gray-200">
            /
          </span>
          <span className="text-gray-900">
            {currentType || "All Collections"}
          </span>
          <span aria-hidden="true" className="text-gray-200">
            /
          </span>
          <span className="text-gray-900">{currentStyle || "All Styles"}</span>{" "}
          <span aria-hidden="true" className="text-gray-200">
            /
          </span>
          <span className="text-gray-900">
            {currentSection || "All Sections"}
          </span>
        </nav>

        <div className="flex items-start gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <aside
            aria-label="Product filters"
            className="sticky top-6 hidden h-fit w-[240px] shrink-0 self-start md:block xl:w-[280px]"
          >
            <Menu />
          </aside>

          {/* Products Content */}
          <main className="min-w-0 flex-1">
            {/* Mobile Filters */}
            <div className="mb-5 md:hidden">
              <MobileFilterDrawer />
            </div>

            {/* Products Header */}
            {!loading && (
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                  {data?.pagination.total} product
                  {data?.pagination.total !== 1 ? "s" : ""}
                </p>

                {keyword && (
                  <p className="max-w-[50%] truncate text-[10px] font-bold text-gray-400">
                    Search: <span className="text-gray-900">{keyword}</span>
                  </p>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div
                aria-label="Loading products"
                className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && hasProducts && (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {displayProducts.map((product: Product) => (
                  <Card key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !hasProducts && (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <PackageSearch
                    size={28}
                    strokeWidth={1.7}
                    className="text-gray-300"
                  />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    No products found
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Try changing the filters or searching for another product.
                  </p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={page}
                  goToPage={goToPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <ShopPaths />
    </section>
  );
};
