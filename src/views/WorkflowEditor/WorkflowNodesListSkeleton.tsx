import React from "react";
import useTheme from "@/utils/hooks/useTheme";

interface WorkflowNodesListSkeletonProps {
  categoryCount?: number;
  nodesPerCategory?: number;
}

const WorkflowNodesListSkeleton: React.FC<WorkflowNodesListSkeletonProps> = ({
  categoryCount = 3,
  nodesPerCategory = 4,
}) => {
  const { isDark } = useTheme();

  return (
    <>
      {Array.from({ length: categoryCount }).map((_, categoryIndex) => (
        <div
          key={categoryIndex}
          className={`
            mb-3 transition-all rounded-2xl
            ${
              isDark
                ? "bg-[#0C1116] border border-[#2B3643]"
                : "bg-[#FFFFFF] border border-[#EEF4FF] shadow-[inset_1px_-6px_6px_0px_#2154EE1A]"
            }
          `}
        >
          {/* Category Header Skeleton */}
          <div
            className={`
              w-full p-3 flex items-center justify-between rounded-t-2xl
            `}
          >
            <div
              className={`h-5 rounded ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
              style={{ width: `${Math.random() * 30 + 40}%` }}
            />
            <div
              className={`w-4 h-4 rounded ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            />
          </div>

          {/* Category Nodes Skeleton */}
          <div className="rounded-b-2xl">
            <hr
              className={`mx-3 ${
                isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"
              }`}
            />
            {Array.from({ length: nodesPerCategory }).map((_, nodeIndex) => (
              <div key={nodeIndex}>
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Icon Skeleton */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg ${
                        isDark
                          ? "bg-[#232634]"
                          : "bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
                      } animate-pulse`}
                    />
                    {/* Node Name Skeleton */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`h-4 rounded ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        } animate-pulse`}
                        style={{
                          width: `${Math.random() * 40 + 50}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                {nodeIndex < nodesPerCategory - 1 && (
                  <hr
                    className={`mx-3 ${
                      isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default WorkflowNodesListSkeleton;



