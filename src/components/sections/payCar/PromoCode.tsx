import { BiSolidDiscount } from "react-icons/bi";
import Button from "@/components/ui/Button";
export const PromoCode = () => {
  return (
    <article>
      <div className=" flex items-center gap-2  p-2 h-fit">
        <div className="relative w-[65%]">
          <input
            type="text"
            placeholder="Add promo code"
            className="border border-gray-300 outline-0 pl-9 py-2 rounded-full w-full "
          />
          <BiSolidDiscount className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-lg" />
        </div>
        <div className=" w-[35%]">
          <Button textBtn="Apply" style="w-full" />
        </div>
      </div>
      <div className="w-full p-3">
        <Button textBtn="Go to Checkout" style="w-full" />
      </div>
    </article>
  );
};
