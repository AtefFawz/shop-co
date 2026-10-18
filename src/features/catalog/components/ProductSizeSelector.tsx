export default function ProductSizeSelector({ product, selectedSize, setSelectedSize }: any) {
  const getSize = product.size.join(",");
  const result = getSize.split(",");

  return (
    <div className="flex gap-x-1 items-center justify-center">
      {result.map((e: any, id: any) => (
        <button
          key={id}
          style={{
            backgroundColor: selectedSize === e ? "var(--action)" : "var(--surface-hover)",
            color: selectedSize === e ? "var(--text-on-action)" : "var(--text-secondary)",
            border: "1px solid var(--border)",
            transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease",
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
