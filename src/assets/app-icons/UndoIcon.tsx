import React, { useId } from "react";

interface UndoIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const UndoIcon: React.FC<UndoIconProps> = ({
  color = "currentColor",
  size = 14,
  className = "",
}) => {
  const clipPathId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M13.9998 14H12.8332C12.8319 12.9174 12.4013 11.8795 11.6358 11.114C10.8703 10.3485 9.83241 9.91786 8.74982 9.91663H5.93232V13.6581L0.5114 8.23721C0.183325 7.90904 -0.000976563 7.464 -0.000976562 6.99996C-0.000976563 6.53593 0.183325 6.09089 0.5114 5.76271L5.93232 0.341797V4.0833H8.74982C10.1417 4.08484 11.4762 4.63846 12.4604 5.62269C13.4447 6.60692 13.9983 7.94138 13.9998 9.3333V14ZM4.76565 3.15813L1.33623 6.58755C1.22688 6.69694 1.16544 6.84528 1.16544 6.99996C1.16544 7.15464 1.22688 7.30299 1.33623 7.41238L4.76565 10.8418V8.74996H8.74982C9.53314 8.74992 10.3065 8.92537 11.0131 9.26344C11.7198 9.60151 12.3417 10.0936 12.8332 10.7035V9.3333C12.8319 8.25071 12.4013 7.21281 11.6358 6.44731C10.8703 5.6818 9.83241 5.2512 8.74982 5.24996H4.76565V3.15813Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id={clipPathId}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UndoIcon;
