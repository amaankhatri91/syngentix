import React from "react";

interface ChevronDownIconProps {
  color?: string;
  size?: number;
  className?: string;
  opacity?: number;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  color = "currentColor",
  size = 12,
  className = "",
  opacity = 0.8,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g opacity={opacity}>
        <path
          d="M2 4L6 8L10 4"
          stroke={color}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default ChevronDownIcon;


