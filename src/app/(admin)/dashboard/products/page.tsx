import { serverApi } from "@/lib/serverApi";
import Link from "next/link";
import ProductList from "@/components/features/admin/ProductList";
export default async function ManageProducts() {
  const products = await serverApi("/product");

  return (
    <div className="bg-[#ffffff] rounded-xl shadow-sm p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Link
          href="/dashboard/products/add"
          className="bg-black text-white px-4 py-2 rounded-lg"
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
        <ProductList initialProducts={products.data.Products} />
      </table>
    </div>
  );
}
