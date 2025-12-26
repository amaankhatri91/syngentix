import React from "react";

interface CloudIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const CloudIcon: React.FC<CloudIconProps> = ({
  color = "currentColor",
  size = 18,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 6C13.1046 6 14 6.89543 14 8C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8C4 6.89543 4.89543 6 6 6C6.74028 6 7.38663 6.4022 7.73244 7H8.26756C8.61337 6.4022 9.25972 6 10 6C11.1046 6 12 6.89543 12 6Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default CloudIcon;

