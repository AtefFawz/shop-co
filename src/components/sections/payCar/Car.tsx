"use client";
import { useProduct } from "@/store/cardStore";
import { Pricing } from "./Pricing";
import { Card } from "./Card";
import { PromoCode } from "./PromoCode";
import Heading from "@/components/ui/Heading";
import { EmptyCart } from "./EmptyCart";
export const Car = () => {
  const Stack = useProduct((e) => e.stack);
  const FILTER = Stack.filter((e) => e.isChose === true);
  console.log("Stack", Stack);
  if (FILTER?.length > 0) {
    return (
      <section className=" w-full ">
        <Heading title="Your cart" styling="text-start py-6" />
        <div className="flex md:flex-row items-start justify-between flex-col gap-4">
          <div className="md:w-[65%] w-full">
            {FILTER.map((e) => (
              <Card productItem={e} key={e.id} />
            ))}
          </div>
          <div className="md:w-[35%] w-full h-fit border border-gray-400 rounded-2xl">
            <Pricing product={FILTER} />
            <PromoCode />
          </div>
        </div>
      </section>
    );
  } else {
    return <EmptyCart />;
  }
};
