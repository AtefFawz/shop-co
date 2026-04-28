import { Star } from "lucide-react";
function ReviewCard({
  rev,
}: {
  rev: { rating: number; comment: string; updatedAt: string };
}) {
  return (
    <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rev.rating ? "fill-black text-black" : "text-gray-100"
            }
          />
        ))}
      </div>
      <p className="text-gray-600 font-medium italic text-sm leading-relaxed mb-6 line-clamp-3">
        "{rev.comment}"
      </p>
      <div className="flex items-center justify-between pt-6 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-300">
        <span className="flex items-center gap-2 text-green-500">
          <Star size={10} className="fill-green-500" /> Verified Purchase
        </span>
        <span>{new Date(rev.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export { ReviewCard };
