import React from "react";

interface MinimapIconProps {
  color?: string;
  size?: number;
}

const MinimapIcon: React.FC<MinimapIconProps> = ({
  color = "#162230",
  size = 14,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.33333 1.16667H11.6667C12.125 1.16667 12.5 1.54167 12.5 2V12C12.5 12.4583 12.125 12.8333 11.6667 12.8333H2.33333C1.875 12.8333 1.5 12.4583 1.5 12V2C1.5 1.54167 1.875 1.16667 2.33333 1.16667ZM2.33333 2V12H11.6667V2H2.33333Z"
        fill={color}
      />
      <path
        d="M3.5 3.5H10.5V10.5H3.5V3.5ZM4.16667 4.16667V9.83333H9.83333V4.16667H4.16667Z"
        fill={color}
      />
      <path
        d="M5.25 5.25H8.75V8.75H5.25V5.25Z"
        fill={color}
      />
    </svg>
  );
};

export default MinimapIcon;

