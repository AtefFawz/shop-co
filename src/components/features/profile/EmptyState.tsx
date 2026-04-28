import { type LucideIcon, Package } from "lucide-react";
function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-4xl p-20 text-center border-2 border-dashed border-gray-100">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package size={32} className="text-gray-200" />
      </div>
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
        {message}
      </p>
    </div>
  );
}

export { EmptyState };
