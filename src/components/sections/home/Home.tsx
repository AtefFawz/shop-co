"use client";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { itemShop, items, brands } from "@/data/shop/Shop";
import { useRouter } from "next/navigation";

export default function ScreenShop() {
  const router = useRouter();
  function handleShopClick() {
    router.push("/shopping");
  }
  return (
    <>
      <div className=" bg-[#F2F0F1] w-full ">
        <div className=" container mx-auto flex md:flex-row flex-col justify-between gap-6 px-6 md:px-4 lg:px-6 pt-16 ">
          <div className="md:w-1/2 w-full space-y-10">
            <h1 className="h1-main tracking-wider italic">{itemShop.title}</h1>
            <p className="p-main tracking-wider leading-6  xl:leading-9">
              {itemShop.description}
            </p>
            <Button textBtn={itemShop.btnText} func={handleShopClick} />
            <div className="flex items-center justify-center md:justify-start gap-y-5 gap-x-2 md:py-16 py-0 flex-wrap w-full ">
              {items.map((e, id) => (
                <div key={id} className="border-l-2 border-gray-300 pl-5 ">
                  <h1 className="h1-main"> {e.title} </h1>
                  <p className="text-sm text-gray-400"> {e.description} </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 w-[calc(100%+3rem)] -mx-6 md:mx-0 h-[450px] md:h-auto relative">
            <Image
              priority={true}
              src={itemShop.image}
              alt="Shop Screen"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className=" bg-gray-950 p-x-3 py-10 items-center flex justify-around flex-wrap ">
        {brands.map((e, id) => (
          <h1
            key={id}
            className="h1-main p-2 col-span-1 text-[#ffffff]! italic tracking-wider"
          >
            {e}
          </h1>
        ))}
      </div>
    </>
  );
}
