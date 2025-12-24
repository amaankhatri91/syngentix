import React from "react";

interface EnvelopeIconProps {
  color?: string;
  size?: number;
}

const EnvelopeIcon: React.FC<EnvelopeIconProps> = ({ color = "#BDC9F5", size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 3H2C1.45 3 1 3.45 1 4V12C1 12.55 1.45 13 2 13H14C14.55 13 15 12.55 15 12V4C15 3.45 14.55 3 14 3ZM13.5 4.5L8 8.75L2.5 4.5H13.5ZM2 11.5V5.25L7.47 9.47C7.61 9.58 7.8 9.58 7.94 9.47L13.5 5.25V11.5H2Z"
        fill={color}
      />
    </svg>
  );
};

export default EnvelopeIcon;

