"use client";
import { useState } from "react";
export default function Sizes({ sizes }: { sizes: string }) {
  const [isSelected, setIsSelected] = useState(false);
  const handleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        style={{
          backgroundColor: isSelected ? "black" : "#e5e7eb",
          color: isSelected ? "white" : "gray",
        }}
        onClick={() => handleSelect()}
        className="w-fit px-4 lg:px-4 xl:px-7 py-1 text-xs font-bold md:text-sm lg:text-lg text-nowrap rounded-full cursor-pointer"
      >
        {sizes}
      </button>
    </div>
  );
}
