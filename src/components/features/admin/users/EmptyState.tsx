import { Package } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Package size={24} className="text-gray-300" />
      </div>

      <p className="text-xs font-black uppercase tracking-widest text-gray-300">
        No users found
      </p>
    </div>
  );
}
