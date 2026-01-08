import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { scrollingType } from "@/data/rating";
import StarRating from "./StarsRating";
export default function Scrolling({ items }: { items: scrollingType }) {
  return (
    <div className="flex flex-col gap-4 w-full md:min-w-80 md:max-w-90 h-60 items-start rounded-2xl border border-gray-200 shadow-lg p-4">
      <StarRating rating={items.rate} />
      <h3 className="font-bold text-xl text-gray-950 flex justify-center items-center gap-1 tracking-wider">
        {items.name}
        <span className="text-green-500 text-sm">
          <VerifiedRoundedIcon />
        </span>
      </h3>
      <p className="text-sm text-gray-500 font-medium"> {items.description} </p>
    </div>
  );
}
