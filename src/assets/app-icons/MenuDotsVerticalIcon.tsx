import React from "react";

interface MenuDotsVerticalIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const MenuDotsVerticalIcon: React.FC<MenuDotsVerticalIconProps> = ({
  color = "currentColor",
  size = 16,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="8" cy="3" r="1.5" fill={color} />
      <circle cx="8" cy="8" r="1.5" fill={color} />
      <circle cx="8" cy="13" r="1.5" fill={color} />
    </svg>
  );
};

export default MenuDotsVerticalIcon;
