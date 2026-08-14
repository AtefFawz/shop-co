// components/layout/navbar/NavIcons.tsx
import { SvgIconComponent } from "@mui/icons-material";
import { useProduct } from "@/store/cardStore";

interface NavIconItem {
  Icon: SvgIconComponent;
  photo?: string;
  key: string;
  action?: () => void;
  isFound?: boolean;
}

export default function NavIcons({ items, containerClass, iconClass }: any) {
  const cartItemsCount = useProduct((state) => state.stack).filter(
    (e) => e.isChose === true,
  ).length;

  return (
    <div className={containerClass}>
      {items.map((item: NavIconItem) => (
        <div
          key={item.key}
          onClick={item.action}
          className={`bg-gray-100 rounded-full flex justify-center items-center cursor-pointer ${iconClass} relative transition-all hover:bg-gray-200 duration-300 overflow-visible`}
        >
          {item.photo ? (
            <img
              src={item.photo}
              alt="Profile"
              className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full border-2 border-blue-500"
            />
          ) : (
            <item.Icon className="text-gray-700" />
          )}

          {item.isFound && cartItemsCount > 0 && (
            <span
              className="
              absolute -top-1 -right-1 flex md:h-5 md:min-w-5 h-4 min-w-4 items-center justify-center 
              rounded-full bg-red-500 px-1 font-extrabold text-[#FFDDAB]
              md:text-[11px] text-[10px] leading-none z-10 shadow-sm"
            >
              {cartItemsCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
