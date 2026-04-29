"use client";
import { useState, useEffect } from "react";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import StarRating from "./StarsRating";

interface Review {
  fullName: string;
  rating: number;
  comment: string;
  avatar: string;
}

export default function Scrolling({ items }: { items: Review }) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="md:min-w-80 md:max-w-90 h-54 bg-gray-50 animate-pulse rounded-2xl border" />
    );
  }

  const isLongText = items.comment.length > 120;

  return (
    <div
      className={`group flex flex-col gap-4 w-full md:w-90 rounded-2xl border border-gray-200 shadow-md p-4 transition-all duration-300 hover:shadow-xl bg-white
      ${isExpanded ? "h-auto" : "h-54"}`}
    >
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
          className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-semibold text-gray-900 truncate max-w-[150px]">
            {items.fullName}
            <VerifiedRoundedIcon className="text-green-500 text-xs" />
          </div>
          <span className="text-xs text-gray-400">Verified Customer</span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="flex-1 overflow-hidden">
        <p
          className={`text-sm text-gray-600 leading-relaxed transition-all duration-300
          ${isExpanded ? "" : "line-clamp-2"}`}
        >
          {items.comment}
        </p>

        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-black mt-2 hover:underline focus:outline-none"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
