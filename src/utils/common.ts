import { NodeAction } from "@/@types/workflow-types";
import { TabItem } from "@/components/Tabs";

export const getActiveTabLabel = (
  tabs: TabItem[],
  activeTab: string | number,
  fallback = "Workflows"
): string => {
  return (
    tabs.find((tab) => String(tab.value) === String(activeTab))?.label ??
    fallback
  );
};

/**
 * Get icon color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Icon color hex code
 */
export const getIconColor = (isDark: boolean): string => {
  return isDark ? "#FFFFFF" : "#162230";
};

/**
 * Get button base styles for workflow editor header
 * @param isDark - Whether the theme is dark
 * @returns Base button styles string
 */
export const getButtonBaseStyles = (isDark: boolean): string => {
  return `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
    isDark ? "border bg-[#0C1116] border-[#394757]" : " border border-[#E3E6EB]"
  }`;
};

/**
 * Get regular button styles for workflow editor header
 * @param isDark - Whether the theme is dark
 * @returns Regular button styles string
 */
export const getButtonStyles = (isDark: boolean): string => {
  const baseStyles = getButtonBaseStyles(isDark);
  return `font-normal ${baseStyles} ${
    isDark
      ? "text-white hover:bg-[#1E293B] bg-[#0C1116]"
      : "text-[#162230] hover:bg-[#F5F7FA] bg-[#F5F7FA]"
  }`;
};

/**
 * Get grouped button styles for workflow editor header
 * @param isDark - Whether the theme is dark
 * @returns Grouped button styles string
 */
export const getGroupedButtonStyles = (isDark: boolean): string => {
  const baseStyles = getButtonBaseStyles(isDark);
  return `font-normal ${baseStyles} ${
    isDark
      ? "text-white bg-[#0C1116] hover:bg-[#1E293B] border-l border-[#2B3643]"
      : "text-[#162230] hover:bg-[#EEF1F6]  bg-[#F5F7FA] border-l border-[#E6E6E6]"
  }`;
};

export const getActionButtonColor = (
  type: NodeAction["type"],
  isDark: boolean
) => {
  switch (type) {
    case "input":
      return `${
        isDark ? "bg-[#4ADE8033] text-[#4ADE80]" : "bg-[#009D39] text-white"
      }`;
    case "output":
      return `${
        isDark ? "bg-[#A78BFA33] text-[#A78BFA]" : "bg-[#714AE3] text-white"
      }`;
    case "trigger":
      return `${
        isDark ? "bg-[#CE93D833] text-[#CE93D8]" : "bg-[#714AE3] text-white"
      }`;
    case "data":
      return `${
        isDark ? "bg-[#FFA50033] text-[#FFA500]" : "bg-[#D78D06] text-white"
      }`;
    case "Visualization":
      return `${
        isDark ? "bg-[#FFA50033] text-[#18FFFF]" : "bg-[#05C9C9] text-white"
      }`;
    default:
      return `${
        isDark ? "bg-[#A78BFA33] text-[#A78BFA]" : "bg-[#714AE3] text-white"
      }`;
  }
};
