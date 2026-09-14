// "use client";
import { useFilterStore } from "@/store/filterStore";
import { AiOutlineRight } from "react-icons/ai";

export const StyleButton = ({ content }: { content: string[] }) => {
  const set = useFilterStore((state) => state.filterByStyle);
  const currentSection = useFilterStore((state) => state.currentStyle);
  return (
    <div className="w-full  pb-5">
      {content.map((e, id) => (
        <button
          key={id}
          className={`w-full text-left cursor-pointer flex items-center justify-between p-2 font-bold text-gray-500 hover:text-gray-800 ${currentSection === e ? "text-gray-800 rounded-xl bg-gray-100 duration-500 " : ""}`}
          onClick={() => set(e)}
        >
          {e}
          <AiOutlineRight className="inline-block ml-2 text-xs" />
        </button>
      ))}
    </div>
  );
};
