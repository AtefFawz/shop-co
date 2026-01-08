"use client";
import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import Color from "@/components/common/Colors";
export const Colors = () => {
  const arrayOfColor = [
    "#9f0712",
    "#193cb8 ",
    "#7bf1a8",
    "#000000",
    " #fff085",
    " #6e11b0",
    "black",
    "#7b3306",
    "#0F2854",
    "#89986D",
    "#301CA0",
    "#FF937E",
    "#540863",
    "#777C6D",
    "#3C467B",
  ];
  const handelActive = () => {
    setActive((prev) => !prev);
  };
  const [active, setActive] = useState(true);
  return (
    <div className="w-full  border-gray-200 pb-4">
      {/* Header */}
      <div
        className="flex items-center justify-between w-full gap-5 cursor-pointer py-4"
        onClick={handelActive}
      >
        <h1 className="font-bold text-sm text-gray-600">COLORS</h1>
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
            {arrayOfColor.map((e, id) => (
              <Color colors={e} key={id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
