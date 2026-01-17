"use client";
import { useState } from "react";
import { FilterButton } from "@/components/common/FilterButton";
import { AiOutlineDown } from "react-icons/ai";
export const Sections = () => {
  const [active, setActive] = useState(false);
  const handelActive = () => {
    setActive((prev) => !prev);
  };
  const fil = ["Casual", "Formal", "Party", "Gym"];
  return (
    <div className="w-full  border-gray-200 pb-4">
      {/* Header */}
      <div
        className="flex items-center justify-between w-full gap-5 cursor-pointer py-4 "
        onClick={handelActive}
      >
        <h1 className="font-bold text-sm text-gray-600">
          {" "}
          {"Dress Style".toLocaleUpperCase()}{" "}
        </h1>
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
          <FilterButton content={fil} />
        </div>
      </div>
    </div>
  );
};
