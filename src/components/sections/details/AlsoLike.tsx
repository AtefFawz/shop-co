import { data } from "@/lib/api";
import { Product } from "@/types";
import Card from "@/components//common/Card";
import Heading from "@/components/ui/Heading";
export const AlsoLike = ({ productItem }: { productItem: Product }) => {
  // && item.id !== productItem?.id عشان ميجيبش نفس المنتج اللي انا فاتحه
  const filteredProducts = data.filter(
    (item) => item.section === productItem?.section
  );
  return (
    <section className="container mx-auto px-2 md:px-6 lg:px-8 xl:px-10 my-10">
      <Heading
        title={`You may also like`.toLocaleUpperCase()}
        styling="pb-16"
      />
      <div className="flex flex-wrap justify-items-stretch justify-center w-full gap-6">
        {filteredProducts.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[45%] md:w-[30%] lg:w-[22%]"
          >
            <Card product={item} />
          </div>
        ))}
      </div>
    </section>
  );
};
