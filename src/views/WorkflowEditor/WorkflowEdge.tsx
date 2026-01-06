import React from "react";
import { getBezierPath, EdgeProps } from "reactflow";
import { useAppSelector } from "@/store";

const WorkflowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const edgeThickness = useAppSelector((state) => state.workflowEditor.edgeThickness);
  
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
  // Check if this edge is connected to an active node
  const isActive = data?.isActive || false;
  
  // Create unique gradient IDs
  const dottedGradientId = `dotted-gradient-${id}`;
  const activeGradientId = `active-gradient-${id}`;

  return (
    <>
      <defs>
        {/* Gradient for dotted edges */}
        {isDotted && (
          <linearGradient
            id={dottedGradientId}
            gradientUnits="userSpaceOnUse"
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
          >
            <stop offset="0%" stopColor="#9133EA" />
            <stop offset="100%" stopColor="#2962EB" />
          </linearGradient>
        )}
        {/* Gradient for active edges: #48D8D1 to #096DBF */}
        {isActive && !isDotted && (
          <linearGradient
            id={activeGradientId}
            gradientUnits="userSpaceOnUse"
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
          >
            <stop offset="0%" stopColor="#48D8D1" />
            <stop offset="49.64%" stopColor="#096DBF" />
            <stop offset="100%" stopColor="#096DBF" />
          </linearGradient>
        )}
      </defs>
      <path
        id={id}
        style={{
          ...style,
          ...(isDotted
            ? {
                stroke: `url(#${dottedGradientId})`,
                strokeWidth: edgeThickness,
                strokeDasharray: style.strokeDasharray || "5,5",
              }
            : isActive
            ? {
                stroke: `url(#${activeGradientId})`,
                strokeWidth: edgeThickness,
              }
            : {
                strokeWidth: edgeThickness,
              }),
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
    </>
  );
};

export default WorkflowEdge;

