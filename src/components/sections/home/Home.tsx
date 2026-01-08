"use client";
import Image from "next/image";
import Button from "@/components/ui/BUtton";
import { itemShop, items, brands } from "@/data/shop/Shop";
import { useRouter } from "next/navigation";
export default function ScreenShop() {
  const router = useRouter();
  function handleShopClick() {
    router.push("/shopping");
  }
  return (
    <>
      <div className=" bg-[#F2F0F1] w-full  pt-22">
        <div className=" container mx-auto flex md:flex-row flex-col justify-between gap-6 px-6 md:px-4 lg:px-6  pt-16  overflow-hidden ">
          <div className="md:w-1/2 w-full space-y-10">
            <h1 className="h1-main tracking-wider italic ">{itemShop.title}</h1>
            <p className="p-main"> {itemShop.description} </p>
            <Button textBtn={itemShop.btnText} func={handleShopClick} />
            <div className="flex items-center justify-center md:justify-start gap-y-5 gap-x-2 py-16 flex-wrap w-full ">
              {items.map((e, id) => (
                <div key={id} className="border-l-2  border-gray-300 pl-5 ">
                  <h1 className="h1-main"> {e.title} </h1>
                  <p className="text-sm text-gray-400"> {e.description} </p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full mt-38 md:mt-0">
            <Image
              priority={true}
              src={itemShop.image}
              alt="Sop Screen"
              className="object-cover overflow-hidden w-full h-full md:scale-110 xl:scale-150 scale-300"
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
