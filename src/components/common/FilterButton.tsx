// "use client";
import { useFilterStore } from "@/store/filterStore";
import { AiOutlineRight } from "react-icons/ai";

export const FilterButton = ({ content }: { content: string[] }) => {
  const set = useFilterStore((state) => state.filterBySection);

  return (
    <div className="w-full border-b border-gray-300 pb-5">
      {content.map((e, id) => (
        <button
          key={id}
          className="w-full text-left cursor-pointer flex items-center justify-between hover:bg-gray-50 p-2 font-bold text-gray-500 hover:text-gray-800 "
          onClick={() => set(e)}
        >
          {e}
          <AiOutlineRight className="inline-block ml-2 text-xs" />
        </button>
      ))}
    </div>
  );
};
