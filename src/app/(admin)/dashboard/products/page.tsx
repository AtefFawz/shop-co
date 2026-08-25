import Link from "next/link";
import ProductList from "@/components/features/admin/ProductList";
import { products } from "@/lib/Products";
import { Plus } from "lucide-react";
import Pagination from "@/components/common/Pagination";

export default async function ManageProducts({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = 10;

  const productsData = await products("/product", page, limit);

  const productList = productsData?.data?.Products ?? [];
  const pagination = productsData?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  };
  const totalCount = pagination?.total ?? productList.length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 flex items-center gap-2">
            <span className="w-4 h-px bg-gray-400 inline-block" />
            Admin Panel
          </p>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-gray-900">
            All Products
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {totalCount} product{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/dashboard/products/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      {/* ── Unified Single Table Container ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Product", "Category", "Price", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 md:px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ${
                      i === 3
                        ? "text-right"
                        : i === 1
                          ? "hidden sm:table-cell text-left"
                          : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <ProductList key={page} initialProducts={productList} />
          </table>
        </div>

        {/* Pagination bar at the bottom */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-50">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
