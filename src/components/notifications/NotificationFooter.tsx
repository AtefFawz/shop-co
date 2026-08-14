"use client";

type NotificationFooterProps = {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
};

export default function NotificationFooter({
  hasMore,
  loading,
  onLoadMore,
}: NotificationFooterProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 p-2.5 sm:p-3">
      <button
        type="button"
        disabled={loading}
        onClick={onLoadMore}
        className="
          w-full
          rounded-xl
          py-2
          text-xs
          font-semibold
          text-gray-700
          transition
          hover:bg-gray-100
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:py-2.5
          sm:text-sm
        "
      >
        {loading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
