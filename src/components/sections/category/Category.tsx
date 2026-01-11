"use client";
import Kids from "@/assets/category/kids.png";
import Men from "@/assets/category/man.png";
import Women from "@/assets/category/women.png";
import Image from "next/image";
import { GoArrowUpRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";
export const Category = () => {
  const router = useRouter();

  const categories = [
    { id: 1, title: "Kids", img: Kids, slug: "KIDS" },
    { id: 2, title: "Men", img: Men, slug: "MEN" },
    { id: 3, title: "Women", img: Women, slug: "WOMEN" },
  ];

  const setSection = useFilterStore((state) => state.filterByType);
  const handleClick = (slug: string) => {
    setSection(slug);
    router.push("/shopping");
  };

  return (
    <section className="content-center container mx-auto  px-4">
      <h2 className="h1-main text-3xl font-bold mb-8 font-integral">
        BROWSE BY DRESS STYLE
      </h2>

      {/* ضفت gap-6 عشان يبقى فيه مسافات أشيك */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 group">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className="
                relative overflow-hidden rounded-3xl cursor-pointer h-80
                transition-all duration-500 ease-in-out
                
                /* اللوجيك بتاعك: كله يبهت ويصغر */
                group-hover:scale-95 group-hover:opacity-50
                
                /* ماعدا اللي واقف عليه: يرجع طبيعي ويكبر */
                hover:scale-100! hover:opacity-100! hover:shadow-2xl
            "
          >
            {/* الخلفية والصورة */}
            <Image
              src={cat.img}
              alt={cat.title}
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
            />

            {/* طبقة سوداء خفيفة عشان الكلام يبان */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            {/* العنوان والأيقونة */}
            <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
              <div>
                <h3 className="text-white text-2xl font-bold tracking-wider">
                  {cat.title}
                </h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 transition-opacity duration-300 hover:opacity-100 group-hover/card:opacity-100">
                  Explore
                </p>
              </div>

              <div className="bg-white p-3 rounded-full text-black transform transition-transform duration-300 hover:rotate-45">
                <GoArrowUpRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
