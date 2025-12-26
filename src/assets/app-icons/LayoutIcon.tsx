import React from "react";

interface LayoutIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const LayoutIcon: React.FC<LayoutIconProps> = ({
  color = "currentColor",
  size = 14,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.25 1.16675H1.75C0.785167 1.16675 0 1.95191 0 2.91675V12.8334H14V2.91675C14 1.95191 13.2148 1.16675 12.25 1.16675ZM1.75 2.33341H12.25C12.5714 2.33341 12.8333 2.59475 12.8333 2.91675V4.08342H1.16667V2.91675C1.16667 2.59475 1.42858 2.33341 1.75 2.33341ZM1.16667 5.25008H4.08333V11.6667H1.16667V5.25008ZM5.25 11.6667V5.25008H12.8333V11.6667H5.25Z"
        fill={color}
      />
    </svg>
  );
};

export default LayoutIcon;
