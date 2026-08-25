"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  Tag,
  DollarSign,
  PackageX,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductList({
  initialProducts = [],
}: {
  initialProducts?: Product[];
}) {
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`product/${id}`);

      setProductsList((prev) => prev.filter((p) => p._id !== id));
      router.refresh();
    } catch (error: any) {
      console.error(
        "Error deleting product:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  //   when not products
  if (!productsList || productsList.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={4} className="py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
              <PackageX size={36} strokeWidth={1.5} />
              <p className="text-xs font-bold uppercase tracking-wider">
                No Products Available
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <>
      {/* ── Confirm Delete Modal ── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-center text-gray-900 mb-1">
              Delete Product?
            </h3>
            <p className="text-xs text-gray-500 text-center mb-6 leading-relaxed">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-extrabold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmId)}
                disabled={!!deletingId}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Table Body (Unified Responsive Layout) ── */}
      <tbody className="divide-y divide-gray-100 bg-white">
        {productsList.map((p) => (
          <tr
            key={p._id}
            className="group hover:bg-gray-50/70 transition-colors duration-150"
          >
            {/* 1. Product Info & Photo */}
            <td className="py-3.5 px-4 md:px-5 align-middle">
              <div className="flex items-center gap-3">
                {p.photo ? (
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shrink-0">
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      sizes="44px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-400 font-bold text-[10px] uppercase shrink-0">
                    N/A
                  </div>
                )}

                <div className="flex flex-col min-w-0 max-w-[180px] sm:max-w-xs">
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900 truncate group-hover:text-black transition-colors">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    ID: {p._id.slice(-6)}
                  </span>
                </div>
              </div>
            </td>

            {/* 2. Category */}
            <td className="py-3.5 px-4 align-middle hidden sm:table-cell">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200/50">
                <Tag size={10} className="text-gray-400" />
                {p.category || "General"}
              </span>
            </td>

            {/* 3. Price */}
            <td className="py-3.5 px-4 align-middle">
              <span className="text-xs sm:text-sm font-black text-gray-900 font-mono">
                ${Number(p.price).toLocaleString()}
              </span>
            </td>

            {/* 4. Actions */}
            <td className="py-3.5 px-4 md:px-5 align-middle text-right">
              <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/products/edit/${p._id}`)
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gray-950 text-white hover:bg-black transition-all active:scale-95 cursor-pointer"
                  title="Edit Product"
                >
                  <Pencil size={18} />
                  <span className="hidden md:inline">Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmId(p._id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95 cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 size={18} />
                  <span className="hidden md:inline">Delete</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
