import React from "react";

interface SearchProps {
  color?: string;
  size?: number;
  className?: string;
  opacity?: number;
}

const Search: React.FC<SearchProps> = ({
  color = "currentColor",
  size = 16,
  className = "",
  opacity = 1,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <path
        d="M7.2593 12.9449C10.5321 12.9449 13.1852 10.2917 13.1852 7.01895C13.1852 3.74615 10.5321 1.09302 7.2593 1.09302C3.9865 1.09302 1.33337 3.74615 1.33337 7.01895C1.33337 10.2917 3.9865 12.9449 7.2593 12.9449Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6666 14.4263L11.4443 11.2041"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Search;
