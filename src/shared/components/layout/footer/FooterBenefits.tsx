"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const FooterBenefits = ({
  feature,
  title,
}: {
  feature: string[];
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary sm:text-sm">
        {title}
      </h3>

      <ul className="flex flex-col gap-3">
        {feature.map((item, index) => (
          <li key={index}>
            <Link
              href="#"
              className="group inline-flex items-center gap-1 text-xs font-medium text-secondary transition-all duration-200 hover:translate-x-1 hover:text-primary sm:text-sm"
            >
              <span className="relative">
                {item.trim()}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-action transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowUpRight
                size={12}
                className="-translate-x-1 translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
