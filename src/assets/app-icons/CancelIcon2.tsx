import React, { useId } from "react";

interface CancelIcon2Props {
  color?: string;
  size?: number;
  className?: string;
}

const CancelIcon2: React.FC<CancelIcon2Props> = ({
  color = "white",
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
          d="M9.16242 5.66242L7.82483 7L9.16242 8.33758C9.3905 8.56567 9.3905 8.93433 9.16242 9.16242C9.04867 9.27617 8.89933 9.33333 8.75 9.33333C8.60067 9.33333 8.45133 9.27617 8.33758 9.16242L7 7.82483L5.66242 9.16242C5.54867 9.27617 5.39933 9.33333 5.25 9.33333C5.10067 9.33333 4.95133 9.27617 4.83758 9.16242C4.6095 8.93433 4.6095 8.56567 4.83758 8.33758L6.17517 7L4.83758 5.66242C4.6095 5.43433 4.6095 5.06567 4.83758 4.83758C5.06567 4.6095 5.43433 4.6095 5.66242 4.83758L7 6.17517L8.33758 4.83758C8.56567 4.6095 8.93433 4.6095 9.16242 4.83758C9.3905 5.06567 9.3905 5.43433 9.16242 5.66242ZM14 7C14 10.8599 10.8599 14 7 14C3.14008 14 0 10.8599 0 7C0 3.14008 3.14008 0 7 0C10.8599 0 14 3.14008 14 7ZM12.8333 7C12.8333 3.7835 10.2165 1.16667 7 1.16667C3.7835 1.16667 1.16667 3.7835 1.16667 7C1.16667 10.2165 3.7835 12.8333 7 12.8333C10.2165 12.8333 12.8333 10.2165 12.8333 7Z"
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

export default CancelIcon2;
