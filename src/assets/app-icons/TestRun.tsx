import React, { useId } from "react";

interface TestRunProps {
  color?: string;
  size?: number;
  useGradient?: boolean;
  className?: string;
}

const TestRun: React.FC<TestRunProps> = ({
  color = "white",
  size = 14,
  useGradient = false,
  className = "",
}) => {
  const gradientId = useId();
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
      <defs>
        <clipPath id={clipPathId}>
          <rect width="14" height="14" fill="white" />
        </clipPath>
        {useGradient && (
          <linearGradient
            id={gradientId}
            x1="0"
            y1="7"
            x2="14"
            y2="7"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#9133EA" />
            <stop offset="100%" stopColor="#2962EB" />
          </linearGradient>
        )}
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M11.9548 4.648L6.38983 0.564669C5.95519 0.246394 5.44088 0.0547161 4.90395 0.0108897C4.36701 -0.0329368 3.82843 0.0728009 3.34792 0.316378C2.86741 0.559955 2.46375 0.931853 2.1817 1.39084C1.89965 1.84982 1.75023 2.37795 1.75 2.91667V11.0833C1.7501 11.6223 1.89953 12.1507 2.18171 12.6099C2.46389 13.0691 2.86779 13.4411 3.34858 13.6847C3.82937 13.9282 4.36824 14.0338 4.90539 13.9897C5.44255 13.9456 5.95698 13.7535 6.39158 13.4348L11.9566 9.35142C12.326 9.08052 12.6264 8.72641 12.8335 8.31779C13.0405 7.90916 13.1484 7.45751 13.1484 6.99942C13.1484 6.54133 13.0405 6.08968 12.8335 5.68105C12.6264 5.27243 12.326 4.91832 11.9566 4.64742L11.9548 4.648ZM11.2642 8.4105L5.69917 12.4938C5.43843 12.6844 5.13005 12.799 4.80817 12.8252C4.48629 12.8513 4.16346 12.7878 3.87541 12.6418C3.58737 12.4958 3.34535 12.2729 3.17614 11.9978C3.00692 11.7228 2.91712 11.4063 2.91667 11.0833V2.91667C2.91343 2.59312 3.00154 2.27523 3.17087 1.99951C3.3402 1.72379 3.58388 1.50144 3.87392 1.358C4.1206 1.23252 4.3934 1.16697 4.67017 1.16667C5.0411 1.16809 5.40179 1.28852 5.69917 1.51025L11.2642 5.59359C11.4855 5.75616 11.6655 5.96855 11.7896 6.21359C11.9137 6.45863 11.9783 6.72943 11.9783 7.00409C11.9783 7.27874 11.9137 7.54954 11.7896 7.79458C11.6655 8.03962 11.4855 8.25201 11.2642 8.41459V8.4105Z"
          fill={useGradient ? `url(#${gradientId})` : color}
        />
      </g>
    </svg>
  );
};

export default TestRun;
