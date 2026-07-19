import Link from "next/link";
import ProductList from "@/components/features/admin/ProductList";
import { products } from "@/lib/Products";
export default async function ManageProducts() {
  const productsData = await products();

  return (
    <div className="bg-[#ffffff] rounded-xl shadow-sm p-4 md:p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-2xl text-xl  font-bold">Products Management</h1>
        <Link
          href="/dashboard/products/add"
          className="bg-black text-nowrap md:text-sm text-xs font-bold text-white px-2 md:px-4 py-2 rounded-lg"
        >
          Add New Product
        </Link>
      </div>

      <table className="w-full text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="py-3">Product</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <ProductList initialProducts={productsData} />
      </table>
    </div>
  );
}
