import React, { useId } from "react";

interface PasteIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const PasteIcon: React.FC<PasteIconProps> = ({
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
          d="M1.75 2.33333H3.02167C3.26083 3.01 3.9025 3.5 4.66667 3.5H5.83333C6.59167 3.5 7.23333 3.01 7.47833 2.33333H8.75C9.07083 2.33333 9.33333 2.59583 9.33333 2.91667V4.08333H10.5V2.91667C10.5 1.95417 9.7125 1.16667 8.75 1.16667H7.48417C7.245 0.49 6.5975 0 5.83333 0H4.66667C3.90833 0 3.255 0.49 3.01583 1.16667H1.75C0.7875 1.16667 0 1.95417 0 2.91667V14H5.25V12.8333H1.16667V2.91667C1.16667 2.59583 1.42917 2.33333 1.75 2.33333ZM4.66667 1.16667H5.83333C6.15417 1.16667 6.41667 1.42917 6.41667 1.75C6.41667 2.07083 6.15417 2.33333 5.83333 2.33333H4.66667C4.34583 2.33333 4.08333 2.07083 4.08333 1.75C4.08333 1.42917 4.34583 1.16667 4.66667 1.16667ZM12.25 5.25H8.16667C7.20417 5.25 6.41667 6.0375 6.41667 7V14H14V7C14 6.0375 13.2125 5.25 12.25 5.25ZM12.8333 12.8333H7.58333V7C7.58333 6.67917 7.84583 6.41667 8.16667 6.41667H12.25C12.5708 6.41667 12.8333 6.67917 12.8333 7V12.8333ZM8.75 7.58333H11.6667V8.75H8.75V7.58333ZM8.75 9.91667H11.6667V11.0833H8.75V9.91667Z"
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

export default PasteIcon;
