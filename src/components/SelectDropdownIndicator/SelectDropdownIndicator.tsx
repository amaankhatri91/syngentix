import React from "react";
import { components } from "react-select";
import useTheme from "@/utils/hooks/useTheme";

const SelectDropdownIndicator = (props: any) => {
  const { isDark } = useTheme();

  return (
    <components.DropdownIndicator {...props}>
      <div>
        <svg
          width={12}
          height={12}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.8">
            <path
              d="M2 4L6 8L10 4"
              stroke={isDark ? "#FFFFFF" : "#0C1116"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </components.DropdownIndicator>
  );
};

export default SelectDropdownIndicator;

