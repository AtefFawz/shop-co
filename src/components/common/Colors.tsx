"use client";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
export default function Colors({ colors }: { colors: string }) {
  const [selectedColor, setSelectedColor] = useState<boolean>(false);
  function handelClick() {
    setSelectedColor(!selectedColor);
  }
  return (
    <div>
      <button
        onClick={() => handelClick()}
        style={{ backgroundColor: colors }}
        className="lg:w-10 lg:h-10 w-7 h-7 rounded-full cursor-pointer flex items-center justify-center"
      >
        {selectedColor === true && <CheckIcon className="text-white " />}
      </button>
    </div>
  );
}
