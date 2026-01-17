"use client";
import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import Sizes from "@/components/common/Sizes";
export const Sizing = () => {
  const array = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X-Large",
  ];
  const [active, setActive] = useState(false);
  const handelActive = () => {
    setActive((prev) => !prev);
  };

  return (
    <div className="w-full border-b border-gray-200 pb-4">
      {/* Header */}
      <div
        className="flex items-center justify-between w-full gap-5 cursor-pointer py-4"
        onClick={handelActive}
      >
        <h1 className="font-bold text-sm text-gray-600">SIZING</h1>
        <AiOutlineDown
          className={`text-xl transition-transform duration-500 ${
            active ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-700 ease-in-out ${
          active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex gap-6 flex-wrap pb-2">
            {array.map((e, id) => (
              <Sizes sizes={e} key={id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
