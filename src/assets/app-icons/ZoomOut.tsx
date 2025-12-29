import React from "react";

interface ZoomOutProps {
  color?: string;
  size?: number;
}

const ZoomOut: React.FC<ZoomOutProps> = ({
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
        d="M13.4167 6.41675H0.583324C0.26116 6.41675 0 6.67791 0 7.00007C0 7.32224 0.26116 7.5834 0.583324 7.5834H13.4166C13.7388 7.5834 14 7.32224 14 7.00007C14 6.67791 13.7388 6.41675 13.4167 6.41675Z"
        fill={color}
      />
    </svg>
  );
};

export default ZoomOut;
