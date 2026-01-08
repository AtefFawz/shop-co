// Search bar Mobile
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
export default function SearchBarMobile({ active }: { active: boolean }) {
  return (
    <div>
      <div
        className={` rounded-full relative max-w-full mx-auto z-5 ${
          active ? "block" : "hidden"
        } flex justify-center items-center w-full `}
      >
        <SearchOutlinedIcon className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none right-5 text-2xl" />{" "}
        <input
          placeholder="Search for products..."
          type="text"
          className="w-full bg-gray-200 rounded-3xl py-3 pl-10 pr-4 outline-none border border-transparent focus:border-gray-400 focus:bg-white transition "
        />
      </div>
    </div>
  );
}
