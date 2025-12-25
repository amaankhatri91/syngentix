import React from "react";

interface UserIconProps {
  color?: string;
  size?: number;
}

const UserIcon: React.FC<UserIconProps> = ({ color = "#AEB9E1", size = 12 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_600_1168)">
        <path
          d="M5 3C5 2.45 5.45 2 6 2C6.55 2 7 2.45 7 3C7 3.55 6.55 4 6 4C5.45 4 5 3.55 5 3ZM12 6C12 9.31 9.31 12 6 12C2.69 12 0 9.31 0 6C0 2.69 2.69 0 6 0C9.31 0 12 2.69 12 6ZM11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11C8.755 11 11 8.755 11 6ZM8.275 3.555L6.38 4.5H5.615L3.72 3.555C3.47 3.43 3.175 3.53 3.05 3.78C2.925 4.025 3.025 4.325 3.275 4.45L5 5.31V7.075L4.065 8.755C3.93 8.995 4.015 9.3 4.26 9.435C4.335 9.48 4.42 9.5 4.505 9.5C4.68 9.5 4.85 9.405 4.94 9.245L5.91 7.5H6.095L7.065 9.245C7.155 9.41 7.325 9.5 7.5 9.5C7.585 9.5 7.665 9.48 7.745 9.435C7.985 9.3 8.075 8.995 7.94 8.755L7.005 7.075V5.31L8.73 4.45C8.975 4.325 9.075 4.025 8.955 3.78C8.83 3.535 8.53 3.435 8.285 3.555H8.275Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_600_1168">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UserIcon;



