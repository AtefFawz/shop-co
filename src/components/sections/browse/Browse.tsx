import Image from "next/image";
import { ItemsBrowse } from "@/data/browse";
import Heading from "@/components/ui/Heading";
export default function Browse() {
  return (
    <section className="container mx-auto p-4 md:p-16 bg-[#F0F0F0] rounded-2xl">
      <Heading title="BROWSE BY dress STYLE" />
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full auto-rows-[200px] md:auto-rows-[280px] pt-16">
        {ItemsBrowse.map((e) => (
          <div
            key={e.name}
            className={`${e.cols} relative rounded-2xl overflow-hidden`}
          >
            <Image
              src={e.image}
              alt={e.name}
              fill
              className="object-fill "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
