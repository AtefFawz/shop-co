// app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-black mb-2">
        Oops! Something went wrong
      </h2>

      <p className="text-gray-500 max-w-sm mx-auto mb-8">
        We ran into an unexpected issue while loading this page. Don't worry,
        your shopping bag is safe!
      </p>

      <button
        onClick={() => reset()}
        className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
      >
        TRY AGAIN
      </button>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-4 text-gray-400 hover:text-black underline text-sm transition-colors"
      >
        or go back to Home
      </button>
    </div>
  );
}
