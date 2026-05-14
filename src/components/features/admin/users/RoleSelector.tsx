"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { ShieldCheck, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RoleSelector({
  userId,
  initialRole,
}: {
  userId: string;
  initialRole: string;
}) {
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const roles = ["USER", "MANAGER", "ADMIN"];

  const handleUpdateRole = async (newRole: string) => {
    if (newRole === role) return;

    try {
      setLoading(true);
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      setRole(newRole);
      setIsOpen(false);
      toast.success(`Role updated to ${newRole}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all
          ${role === "ADMIN" ? "bg-black text-white" : "bg-gray-100 text-gray-600"} 
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <ShieldCheck size={12} />
        )}
        {role}
        <ChevronDown
          size={10}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-32 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => handleUpdateRole(r)}
              className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors
                ${r === role ? "bg-gray-50 text-black" : "text-gray-400 hover:bg-gray-50 hover:text-black"}`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
