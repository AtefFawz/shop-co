import { IoMdStar } from "react-icons/io";

interface Props {
  rating: number;
}

export default function StarRating({ rating }: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isActive = starIndex <= rating;

        return (
          <IoMdStar
            key={starIndex}
            className={`md:text-2xl text-lg  ${
              isActive
                ? "fill-rating text-rating"
                : "fill-border-strong text-subtle"
            }`}
          />
        );
      })}
    </div>
  );
}
