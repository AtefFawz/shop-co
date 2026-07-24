// Reusable Stat Card (Maintained Design)
export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white p-7 rounded-[35px] border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 truncate">
          {label}
        </p>
        <p className="text-2xl font-black text-gray-900 tracking-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
