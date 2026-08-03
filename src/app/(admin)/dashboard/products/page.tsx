import Link from "next/link";
import ProductList from "@/components/features/admin/ProductList";
import { products } from "@/lib/Products";
import { Plus } from "lucide-react";

export default async function ManageProducts() {
  const productsData = await products();

  return (
    <div className="bg-white rounded-2xl  shadow-sm p-4 md:p-6 space-y-6">
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
            Products Management
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage, update, and organize your product catalog
          </p>
        </div>

        <Link
          href="/dashboard/products/add"
          className="inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-gray-950/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-nowrap"
        >
          <Plus size={16} />
          Add New Product
        </Link>
      </div>

      {/* ── Table Container ── */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          {/* Table Header (Hidden on Mobile for clean responsive layout) */}
          <thead className="bg-gray-50/80 border-b border-gray-100 hidden md:table-header-group">
            <tr>
              <th className="py-3.5 px-5 text-[11px] font-black uppercase tracking-wider text-gray-400">
                Product Details
              </th>
              <th className="py-3.5 px-4 text-[11px] font-black uppercase tracking-wider text-gray-400">
                Category
              </th>
              <th className="py-3.5 px-4 text-[11px] font-black uppercase tracking-wider text-gray-400">
                Price
              </th>
              <th className="py-3.5 px-5 text-right text-[11px] font-black uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          {/* Product Items Body */}
          <ProductList initialProducts={productsData} />
        </table>
      </div>
    </div>
  );
}
