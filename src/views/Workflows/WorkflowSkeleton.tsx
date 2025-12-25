import React from "react";
import useTheme from "@/utils/hooks/useTheme";

interface WorkflowSkeletonProps {
  count?: number;
}

const WorkflowSkeleton: React.FC<WorkflowSkeletonProps> = ({ count = 3 }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${isDark ? "bg-[#0F1724]" : "bg-white"} ${isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"} border rounded-2xl px-4 py-3 flex flex-wrap items-center gap-y-4 transition-all duration-200`}
        >
          {/* Left Section - Icon, Title, Description */}
          <div className="flex items-center gap-4 min-w-0 basis-full xl:basis-4/12">
            {/* Icon Skeleton */}
            {!isDark ? (
              <div className="bg-gradient-to-r from-[#9133EA] to-[#2962EB] rounded-full p-[1px] flex-shrink-0 animate-pulse">
                <div className="bg-white rounded-full p-3 w-14 h-14" />
              </div>
            ) : (
              <div className="bg-[#1C2643] rounded-full p-3 w-14 h-14 flex-shrink-0 animate-pulse" />
            )}
            {/* Title and Description Skeleton */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div
                className={`h-5 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                style={{ width: "60%" }}
              />
              <div
                className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                style={{ width: "80%" }}
              />
            </div>
          </div>

          {/* Middle Section - Metrics Skeleton */}
          <div className="flex flex-wrap items-center gap-2 basis-full md:basis-6/12 xl:basis-4/12">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`${isDark ? "bg-[#0C1116]" : "bg-[#F5F7FA]"} ${isDark ? "border-[#394757]" : "border-[#E3E6EB]"} border h-[36px] px-3 rounded-lg flex items-center gap-1 animate-pulse`}
                style={{ width: item <= 2 ? "100px" : "80px" }}
              >
                <div
                  className={`h-4 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  style={{ width: "60%" }}
                />
              </div>
            ))}
          </div>

          {/* Status Skeleton */}
          <div className="flex items-center justify-start lg:justify-center basis-full md:basis-3/12 xl:basis-2/12">
            <div
              className={`h-6 w-16 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
            />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-4 justify-start lg:justify-end basis-full md:basis-3/12 xl:basis-2/12">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`w-6 h-6 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkflowSkeleton;
