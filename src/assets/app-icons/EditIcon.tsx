import React from "react";

interface EditIconProps {
  theme?: string;
  height?: number | string;
}

const EditIcon: React.FC<EditIconProps> = ({ 
  theme = "light", 
  height = 18 
}) => {
  const color = theme === "dark" ? "#FFFFFF" : "#162230";
  
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_634_35425)">
        <path
          d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM9 16.5C4.8645 16.5 1.5 13.1355 1.5 9C1.5 4.8645 4.8645 1.5 9 1.5C13.1355 1.5 16.5 4.8645 16.5 9C16.5 13.1355 13.1355 16.5 9 16.5ZM10.0343 4.78425L4.5 10.3185V13.5H7.6815L13.2157 7.96575C14.0933 7.08825 14.0933 5.66175 13.2157 4.78425C12.3383 3.90675 10.9117 3.90675 10.0343 4.78425ZM7.0605 12H6V10.9395L9.252 7.6875L10.3125 8.748L7.0605 12ZM12.1553 6.90525L11.373 7.6875L10.3125 6.627L11.0948 5.84475C11.388 5.5515 11.862 5.5515 12.1553 5.84475C12.4485 6.138 12.4478 6.61275 12.1553 6.90525Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_634_35425">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default EditIcon;
