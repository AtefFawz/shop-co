"use client";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Pencil, Trash2, AlertTriangle, Tag, DollarSign } from "lucide-react";
import { useState } from "react";

export default function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`product/${id}`);
      router.refresh();
    } catch (error: any) {
      console.log("Error:", error.response?.message);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <>
      {/* ── Confirm Modal ── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-2 pb-4 sm:pb-0">
          <div className="bg-white rounded-3xl p-4 w-full max-w-sm shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-center mb-1">
              Delete Product?
            </h3>
            <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed px-2">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-xs font-black uppercase tracking-widest hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={!!deletingId}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deletingId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MOBILE — Card List (< md)
      ══════════════════════════════════════ */}
      <tbody className="md:hidden">
        {initialProducts.map((p) => (
          <tr key={p._id}>
            <td colSpan={4} className="px-0 py-1.5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex items-center justify-between gap-3 hover:border-gray-300 transition-colors">
                {/* Left info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-black text-sm uppercase tracking-tight text-gray-900 truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Price */}
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-700">
                      <DollarSign size={10} className="text-gray-400" />
                      {p.price}
                    </span>
                    {/* Category */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500">
                      <Tag size={8} />
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center  gap-2 shrink-0">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/products/edit/${p._id}`)
                    }
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-black transition-all active:scale-95"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmId(p._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      {/* ══════════════════════════════════════
          DESKTOP — Table Rows (≥ md)
      ══════════════════════════════════════ */}
      <tbody className="hidden md:table-row-group">
        {initialProducts.map((p) => (
          <tr
            key={p._id}
            className="group border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
          >
            {/* Name */}
            <td className="py-4 px-4">
              <span className="font-black text-sm uppercase tracking-tight text-gray-900">
                {p.name}
              </span>
            </td>

            {/* Price */}
            <td className="py-4 px-4">
              <span className="text-sm font-bold text-gray-700">
                ${p.price}
              </span>
            </td>

            {/* Category */}
            <td className="py-4 px-4">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500">
                {p.category}
              </span>
            </td>

            {/* Actions */}
            <td className="py-4 px-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/products/edit/${p._id}`)
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white hover:bg-black transition-all hover:shadow-md hover:shadow-black/15 hover:-translate-y-px active:translate-y-0"
                >
                  <Pencil size={11} />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(p._id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all hover:-translate-y-px active:translate-y-0"
                >
                  <Trash2 size={11} />
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}
