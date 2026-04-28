export default function Sizes({ product, selectedSize, setSelectedSize }: any) {
  const getSize = product.size.join(",");
  const result = getSize.split(",");

  return (
    <div className="flex gap-x-1 items-center justify-center">
      {result.map((e: any, id: any) => (
        <button
          key={id}
          style={{
            backgroundColor: selectedSize === e ? "black" : "#e5e7eb",
            color: selectedSize === e ? "white" : "gray",
          }}
          onClick={() => setSelectedSize(e)}
          className=" min-w-fit px-8 py-1 text-sm font-bold md:text-sm lg:text-lg text-nowrap rounded-full cursor-pointer w-16"
        >
          {e}
        </button>
      ))}
    </div>
  );
}
