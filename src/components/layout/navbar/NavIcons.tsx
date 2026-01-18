// components/layout/navbar/NavIcons.tsx
import { SvgIconComponent } from "@mui/icons-material";
import { useProduct } from "@/store/cardStore";

interface NavIconItem {
  Icon: SvgIconComponent;
  key: string;
  action?: () => void;
  isFound?: boolean;
}

interface NavIconsProps {
  items: NavIconItem[];
  containerClass?: string;
  iconClass?: string;
}

export default function NavIcons({
  items,
  containerClass,
  iconClass,
}: NavIconsProps) {
  const Count = useProduct((state) => state.stack).filter(
    (e) => e.isChose === true,
  );
  return (
    <div className={containerClass}>
      {items.map((item) => (
        <div
          key={item.key}
          onClick={item.action}
          className={`bg-gray-100 rounded-full flex justify-center items-center cursor-pointer ${iconClass} relative transition-colors hover:bg-gray-200`}
        >
          <item.Icon className="text-gray-700" />
          {item.isFound && Count.length > 0 && (
            <span
              className="
              absolute -top-1 -right-1 flex md:h-5 md:min-w-5 h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-extrabold text-[#FFDDAB]
              md:text-[12px] text-[12px]  leading-none "
            >
              {Count.length}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
