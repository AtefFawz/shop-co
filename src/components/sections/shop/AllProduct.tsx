"use client";
import Card from "@/components/common/Card";
import { Menu } from "@/components/sections/shop/menu/Menu";
import { useFilterStore } from "@/store/filterStore";
import { ShopPaths } from "./Paths";
import { MainMenu } from "./MenuPhone/MainMenue";
export const AllProduct = () => {
  const product = useFilterStore((state) => state.products);

  return (
    // <section className="">
    <section className="container mx-auto  flex gap-6 justify-between  my-10 relative ">
      <div className="hidden md:block md:col-span-2 sticky top-30 h-fit w-[30%] xl:w-[25%] self-start ">
        <Menu />
      </div>

      {/* Products Section */}
      <div className="xl:w-[75%] md:w-[70%] w-full ">
        <h1 className="pb-4 font-bold md:block hidden">Category</h1>
        <div className="md:hidden pb-6 px-4 ">
          <MainMenu />
        </div>
        <div className="flex flex-wrap justify-center md:justify-start content-start  gap-6 w-full ">
          {product.map((e) => (
            <div key={e.id} className="w-[46%] md:w-[46%] lg:w-[30%]">
              <Card product={e} />
            </div>
          ))}
        </div>
      </div>
      <ShopPaths />
    </section>
    // </section>
  );
};
