import Link from "next/link";
import { FaShoppingBasket } from "react-icons/fa";

export const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 w-full">
      <div className="bg-gray-100 p-6 rounded-full">
        <FaShoppingBasket className="text-6xl text-gray-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Looks like you haven't added anything to your cart yet. Go ahead and
          explore our top categories.
        </p>
      </div>

      <Link
        href="/"
        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
      >
        Start Shopping
      </Link>
    </div>
  );
};
