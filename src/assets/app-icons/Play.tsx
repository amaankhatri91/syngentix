import React, { useId } from "react";

interface PlayProps {
  color?: string;
  size?: number;
  useGradient?: boolean;
  className?: string;
}

const Play: React.FC<PlayProps> = ({
  color = "white",
  size = 15,
  useGradient = false,
  className = "",
}) => {
  const gradientId = useId();
  const clipPathId = useId();

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
        <clipPath id={clipPathId}>
          <rect width="15" height="15" fill="white" />
        </clipPath>
        {useGradient && (
          <linearGradient
            id={gradientId}
            x1="0"
            y1="7.5"
            x2="15"
            y2="7.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#9133EA" />
            <stop offset="100%" stopColor="#2962EB" />
          </linearGradient>
        )}
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M10.2469 6.32625L7.00187 4.54938C6.58125 4.3125 6.08125 4.31687 5.66562 4.56C5.24875 4.80375 5.00063 5.23688 5.00063 5.71938V9.28125C5.00063 9.76375 5.24875 10.1969 5.66562 10.4406C5.87812 10.565 6.11188 10.6263 6.345 10.6263C6.56875 10.6263 6.7925 10.5694 6.99563 10.455L10.2531 8.67125C10.6825 8.43 10.9381 7.9925 10.9381 7.50063C10.9381 7.00875 10.6825 6.57125 10.2475 6.32688L10.2469 6.32625ZM9.64625 7.57812L6.38875 9.3625C6.37687 9.36875 6.34062 9.38875 6.29688 9.36188C6.25062 9.335 6.25063 9.295 6.25063 9.28187V5.72C6.25063 5.70688 6.25062 5.66687 6.29688 5.64C6.31375 5.63 6.32938 5.62687 6.34313 5.62687C6.36562 5.62687 6.38375 5.63688 6.395 5.64313L9.64 7.42063C9.65187 7.4275 9.6875 7.4475 9.6875 7.50187C9.6875 7.55625 9.65125 7.57625 9.64625 7.58V7.57812ZM7.5 0C3.36437 0 0 3.36437 0 7.5C0 11.6356 3.36437 15 7.5 15C11.6356 15 15 11.6356 15 7.5C15 3.36437 11.6356 0 7.5 0ZM7.5 13.75C4.05375 13.75 1.25 10.9462 1.25 7.5C1.25 4.05375 4.05375 1.25 7.5 1.25C10.9462 1.25 13.75 4.05375 13.75 7.5C13.75 10.9462 10.9462 13.75 7.5 13.75Z"
          fill={useGradient ? `url(#${gradientId})` : color}
        />
      </g>
    </svg>
  );
};

export default Play;
