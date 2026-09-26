"use client";
import Image from "next/image";
import { ItemsBrowse } from "@/data/browse";
import Heading from "@/components/ui/Heading";
import { useFilterStore } from "@/store/filterStore";
import { useRouter } from "next/navigation";
export default function Browse() {
  const { filterByStyle } = useFilterStore((state) => state);
  const router = useRouter();
  const handleClick = (name: string) => {
    filterByStyle(name);
    router.push("/shop");
  };
  return (
    <div className="Responsive p-4 md:p-16 bg-[#F0F0F0] rounded-2xl">
      <Heading title="BROWSE BY dress STYLE" />
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full auto-rows-[200px] md:auto-rows-[280px] pt-16 group">
        {ItemsBrowse.map((e) => (
          <div
            key={e.name}
            className={`${e.cols} relative rounded-2xl overflow-hidden  cursor-pointer  transition-all duration-500 ease-in-out
                group-hover:scale-95 group-hover:opacity-50
                hover:scale-100! hover:opacity-100!`}
          >
            <Image
              onClick={() => handleClick(e.name)}
              src={e.image}
              alt={e.name}
              fill
              className="object-cover w-full h-full  hover:scale-110 transition-all duration-500 ease-in-out 
               "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw "
            />

            <span className="absolute top-6 left-6 text-black text-2xl font-extrabold">
              {e.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
