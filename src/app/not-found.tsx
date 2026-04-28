// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white relative overflow-hidden">
      {/* Background Stylized Text */}
      <h1 className="text-[10rem] md:text-[15rem] font-black text-gray-50 absolute opacity-50 select-none z-0">
        404
      </h1>

      <div className="z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-black uppercase tracking-tighter italic">
          Lost in the Trends?
        </h2>

        <p className="mt-6 text-gray-500 max-w-md mx-auto text-lg">
          The page you are looking for is out of stock or has been moved to a
          new collection.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-black text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-xl"
          >
            BACK TO HOME
          </Link>

          <Link
            href="/shop"
            className="border border-black text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            BROWSE SHOP
          </Link>
        </div>
      </div>
    </div>
  );
}
