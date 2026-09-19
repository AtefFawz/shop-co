export default function Counter({ quantity, setQuantity, logicQuantity }: any) {
  const StyleButton = "text-2xl font-bold cursor-pointer";

  return (
    <article className="w-full">
      <div className=" rounded-full bg-gray-200 flex justify-around items-center text-2sx w-full py-1">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={StyleButton}
        >
          -
        </button>
        <span className="font-bold ">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          disabled={logicQuantity}
          className={`${StyleButton} ${logicQuantity ? " opacity-20" : "opacity-100"}`}
        >
          +
        </button>
      </div>
    </article>
  );
}
