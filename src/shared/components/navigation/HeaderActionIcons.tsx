"use client";

import type { ElementType } from "react";
import { useProduct } from "@/store/cartStore";

export interface NavIconItem {
  Icon: ElementType;
  photo?: string;
  key: string;
  label?: string;
  action?: () => void;
  isFound?: boolean;
  badgeCount?: number;
}

interface NavIconsProps {
  items: NavIconItem[];
  containerClass?: string;
  iconClass?: string;
}

export default function HeaderActionIcons({
  items,
  containerClass = "flex items-center gap-2",
  iconClass = "p-2",
}: NavIconsProps) {
  const cartItemsCount = useProduct((state) => state.stack).reduce(
    (total, item) => total + (item.isChose === true ? Math.max(1, Number(item.count) || 1) : 0),
    0,
  );

  return (
    <div className={containerClass}>
      {items.map((item) => {
        const Icon = item.Icon;
        const label = item.label ?? item.key;
        const badgeCount = item.badgeCount ?? (item.isFound ? cartItemsCount : 0);

        return (
          <button
            key={item.key}
            type="button"
            aria-label={label}
            onClick={item.action}
            className={`group relative inline-flex shrink-0 items-center justify-center rounded-full bg-surface-muted text-secondary transition-all duration-200 hover:bg-surface-hover hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${iconClass}`}
          >
            {item.photo ? (
              // Profile images are remote and may not be covered by next/image config.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.photo}
                alt=""
                className="h-8 w-8 rounded-full border border-border-strong object-cover lg:h-9 lg:w-9"
              />
            ) : (
              <Icon className="h-[19px] w-[19px] shrink-0 transition-transform duration-200 group-hover:scale-105" />
            )}

            {badgeCount > 0 && (
              <span className="absolute -right-1 -top-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-extrabold leading-none text-on-danger shadow-sm ring-2 ring-surface md:h-5 md:min-w-5 md:text-[11px]">
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
