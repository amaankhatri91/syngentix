// components/Breadcrumb.tsx
import React from "react";
import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi2";
import useTheme from "@/utils/hooks/useTheme";
import { getIconColor } from "@/utils/common";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { isDark } = useTheme();

  // Theme-based colors
  const inactiveColor = isDark ? "#AEB9E1" : "#646567";

  return (
    <nav className="flex items-center text-[18px]">
      {items?.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                style={{ color: inactiveColor }}
                className="hover:opacity-80 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{ color: isLast ? getIconColor(isDark) : inactiveColor }}
                className={isLast ? "font-medium" : ""}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <HiChevronRight
                className="mx-2"
                size={16}
                color={inactiveColor}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
