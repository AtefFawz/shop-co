import Image from "next/image";
import { pay } from "@/data/payType";
export const CopyRight = () => {
  return (
    <div className=" text-gray-900 container mx-auto text-center flex justify-between md:flex-row flex-col items-center py-4 mt-10 border-t-2 w-full border-gray-300 ">
      <div className=" w-full text-center  md:text-start">
        <p className="md:text-lg text-sm text-gray-500 tracking-wide ">
          &copy; {new Date().getFullYear()} Shop.co. All rights reserved.
        </p>
      </div>
      <div className="flex md:justify-end justify-center items-center gap-4 mt-4 w-full">
        {pay.map((item, index) => (
          <Image
            key={index}
            src={item.src}
            alt={item.alt}
            className="w-[14%] md:w-[16%] lg:w-[10%] h-6 object-fill bg-white px-3 py-1 rounded-2xl shadow-md hover:scale-110 transition-all duration-300 hover:bg-gray-500 hover:text-white"
            width={500}
            height={500}
          />
        ))}
      </div>
    </div>
  );
};
