import React from "react";

interface LogoutIconProps {
  color?: string;
  size?: number;
}

const LogoutIcon: React.FC<LogoutIconProps> = ({ color = "#AEB9E1", size = 12 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_619_687)">
        <path
          d="M4 0C2.3455 0 1 1.3455 1 3C1 4.6545 2.3455 6 4 6C5.6545 6 7 4.6545 7 3C7 1.3455 5.6545 0 4 0ZM4 5C2.897 5 2 4.103 2 3C2 1.897 2.897 1 4 1C5.103 1 6 1.897 6 3C6 4.103 5.103 5 4 5ZM2.25 7H5.5V8H2.25C1.5605 8 1 8.561 1 9.25V12H0V9.25C0 8.0095 1.0095 7 2.25 7ZM8 11H9V12H8C7.173 12 6.5 11.327 6.5 10.5V7.5C6.5 6.673 7.173 6 8 6H9V7H8C7.724 7 7.5 7.2245 7.5 7.5V10.5C7.5 10.7755 7.724 11 8 11ZM12 9.0295C12 9.3035 11.88 9.5645 11.671 9.7455L10.3305 10.9265L9.6695 10.1765L10.437 9.4995H8.5V8.4995H10.37L9.6695 7.882L10.3305 7.132L11.6745 8.317C11.88 8.4945 12 8.7555 12 9.0295Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_619_687">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LogoutIcon;
