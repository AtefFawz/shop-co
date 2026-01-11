import ValueLabelComponent from "./Slider";
import { useFilterStore } from "@/store/filterStore";
import { PiFadersHorizontalLight } from "react-icons/pi";
import { Colors } from "./Colors";
import { Sizing } from "./Sizing";
import { FilterButton } from "@/components/common/FilterButton";
import { Sections } from "./Sections";
export const fil = ["T-SHIRT", "SHIRT", "PANTS", "JEANS"];
export const Menu = () => {
  const reset = useFilterStore((state) => state.resetFilter);

  return (
    <nav className="text-sm font-bold text-gray-600 flex flex-col items-center justify-start gap-y-8 py-2 hover:text-gray-800 cursor-pointer border border-gray-300 p-4 h-full bg-white rounded-lg shadow-sm w-full">
      <h1 className="border-b border-gray-300 w-full flex justify-between items-center py-4 font-bold text-lg">
        Filter
        <PiFadersHorizontalLight
          onClick={() => reset()}
          className="bg-[#EEEEEE] cursor-pointer w-6 h-6 rounded-2xl "
        />
      </h1>
      <FilterButton content={fil} />
      <ValueLabelComponent />
      <Colors />
      <Sizing />
      <Sections />
    </nav>
  );
};
