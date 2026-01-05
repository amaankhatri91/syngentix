import React from "react";
import { Handle, Position } from "reactflow";
import useTheme from "@/utils/hooks/useTheme";
import {
  getNodeBgColor,
  getNodeTextColor,
  getHandleColor,
  sortOutputsWithNextFirst,
  getNodeGradientBorderStyle,
  calculateNodeEstimatedWidth,
  calculateNodeEstimatedHeight,
} from "@/utils/common";
import { WorkflowCanvasNodeProps } from "./type";

const WorkflowCanvasNode: React.FC<WorkflowCanvasNodeProps> = ({ data, selected }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        ${getNodeBgColor(isDark)}
        !rounded-2xl px-4 pt-2 pb-4 relative
        transition-all duration-200
        flex flex-col
      `}
      style={{
        ...getNodeGradientBorderStyle(selected, isDark),
        minWidth: `${calculateNodeEstimatedWidth(data)}px`,
        minHeight: `${calculateNodeEstimatedHeight(data)}px`,
      }}
    >
      {/* Dot indicator - top right */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.dotColor }}
        />
      </div>
      {/* Node Label */}
      <div className={`font-normal mb-3 ${getNodeTextColor(isDark)} pr-6`}>
        {data.label}
      </div>
      {/* Content Container */}
      <div className="flex-1 flex gap-4">
        {/* Input Handles - Left Side */}
        {data.inputs && data.inputs.length > 0 && (
          <div className="flex flex-col gap-3 flex-1">
            {data.inputs.map((input: string) => (
              <div
                key={input}
                className="flex items-center gap-2 relative"
                style={{ minHeight: "24px" }}
              >
                <Handle
                  type="target"
                  position={Position.Left}
                  id={input}
                  className="w-3 h-3 border-2 border-[#FFFFFF] flex-shrink-0"
                  style={{
                    left: -23,
                    backgroundColor: getHandleColor(input, isDark),
                  }}
                />
                <span
                  className={`text-xs whitespace-nowrap ${
                    isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                  }`}
                >
                  {input}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Output Handles - Right Side */}
        {sortOutputsWithNextFirst(data.outputs)?.length > 0 && (
          <div className="flex flex-col gap-3 flex-1">
            {sortOutputsWithNextFirst(data.outputs)?.map((output: string) => (
              <div
                key={output}
                className="flex items-center justify-end gap-2 relative"
                style={{ minHeight: "24px" }}
              >
                <span
                  className={`text-xs font-normal whitespace-nowrap ${
                    isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                  }`}
                >
                  {output}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={output}
                  className="w-3 h-3 border-2 border-[#FFFFFF] flex-shrink-0"
                  style={{
                    right: -23,
                    backgroundColor: getHandleColor(output, isDark),
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCanvasNode;
