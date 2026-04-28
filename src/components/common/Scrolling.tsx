"use client";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import StarRating from "./StarsRating";
interface Review {
  fullName: string;
  rating: number;
  comment: string;
  avatar: string;
}
export default function Scrolling({ items }: { items: Review }) {
  return (
    <div className="group flex flex-col gap-4 w-full md:min-w-80 md:max-w-90 min-h-50 rounded-2xl border border-gray-200 shadow-md p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      {/* Rating */}
      <StarRating rating={items.rating} />

      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={items.avatar}
          alt={items.fullName}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/40";
          }}
          className="w-10 h-10 rounded-full object-cover border"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-semibold text-gray-900">
            {items.fullName}

            {true && <VerifiedRoundedIcon className="text-green-500 text-xs" />}
          </div>

          <span className="text-xs text-gray-400">Verified Customer</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {items.comment}
      </p>
    </div>
  );
}
