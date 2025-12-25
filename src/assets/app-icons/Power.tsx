import React, { useId } from "react";

interface PowerProps {
  color?: string;
  size?: number;
  useGradient?: boolean;
  className?: string;
}

const Power: React.FC<PowerProps> = ({
  color = "white",
  size = 15,
  useGradient = false,
  className = "",
}) => {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {useGradient && (
          <linearGradient
            id={gradientId}
            x1="2.51611"
            y1="7.5"
            x2="13.1232"
            y2="7.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#9133EA" />
            <stop offset="100%" stopColor="#2962EB" />
          </linearGradient>
        )}
      </defs>
      <path
        d="M7.85358 15H5.4492L6.6992 10H4.11608C3.86644 9.9999 3.62028 9.9414 3.39728 9.82919C3.17428 9.71698 2.98062 9.55417 2.83177 9.35376C2.68292 9.15335 2.58301 8.9209 2.54002 8.67499C2.49704 8.42908 2.51216 8.17652 2.5842 7.9375L4.98483 0H10.9017L9.0267 5H11.5411C11.8271 5.00018 12.1078 5.07788 12.3533 5.22482C12.5987 5.37177 12.7998 5.58248 12.935 5.83456C13.0703 6.08663 13.1347 6.37064 13.1215 6.65641C13.1083 6.94218 13.0178 7.21902 12.8598 7.4575L7.85358 15ZM7.05045 13.75H7.18295L11.818 6.76625C11.8512 6.71617 11.8702 6.65802 11.873 6.598C11.8758 6.53797 11.8623 6.4783 11.8339 6.42535C11.8055 6.37239 11.7632 6.32812 11.7117 6.29725C11.6601 6.26637 11.6012 6.25004 11.5411 6.25H7.22295L9.09795 1.25H5.91233L3.78045 8.2975C3.76454 8.34991 3.76112 8.40531 3.77048 8.45928C3.77984 8.51324 3.80171 8.56426 3.83433 8.60825C3.86696 8.65224 3.90944 8.68798 3.95837 8.71259C4.00729 8.73721 4.06131 8.75002 4.11608 8.75H8.30358L7.05045 13.75Z"
        fill={useGradient ? `url(#${gradientId})` : color}
      />
    </svg>
  );
};

export default Power;
