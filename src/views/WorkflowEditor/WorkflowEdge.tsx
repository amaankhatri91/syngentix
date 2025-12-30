import React from "react";
import { getBezierPath, EdgeProps } from "reactflow";

const WorkflowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Check if this is a dotted edge (has strokeDasharray)
  const isDotted = style.strokeDasharray;
  const gradientId = `gradient-${id}`;

  return (
    <>
      {isDotted && (
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
          >
            <stop offset="0%" stopColor="#9133EA" />
            <stop offset="100%" stopColor="#2962EB" />
          </linearGradient>
        </defs>
      )}
      <path
        id={id}
        style={{
          ...style,
          ...(isDotted
            ? {
                stroke: `url(#${gradientId})`,
                strokeWidth: 2,
                strokeDasharray: style.strokeDasharray || "5,5",
              }
            : {}),
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
    </>
  );
};

export default WorkflowEdge;

