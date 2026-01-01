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

export const getCategoryColor = (
  category: string,
  isDark: boolean
) => {
  switch (category.toLowerCase()) {
    case "trigger":
      return `${
        isDark ? "bg-[#CE93D833] text-[#CE93D8]" : "bg-[#714AE3] text-white"
      }`;
    case "core":
      return `${
        isDark ? "bg-[#4ADE8033] text-[#4ADE80]" : "bg-[#009D39] text-white"
      }`;
    case "logic":
      return `${
        isDark ? "bg-[#A78BFA33] text-[#A78BFA]" : "bg-[#714AE3] text-white"
      }`;
    case "integration":
      return `${
        isDark ? "bg-[#FFA50033] text-[#FFA500]" : "bg-[#D78D06] text-white"
      }`;
    default:
      return `${
        isDark ? "bg-[#A78BFA33] text-[#A78BFA]" : "bg-[#714AE3] text-white"
      }`;
  }
};

/**
 * Get workflow canvas background color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Background color
 */
export const getWorkflowCanvasBg = (isDark: boolean): string => {
  return isDark ? "#0F1724" : "#FFFFFF";
};

/**
 * Get workflow canvas border color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Border color
 */
export const getWorkflowCanvasBorderColor = (isDark: boolean): string => {
  return isDark ? "#2B3643" : "#EEF4FF";
};

/**
 * Get workflow canvas shadow style based on theme
 * @param isDark - Whether the theme is dark
 * @returns Shadow style string
 */
export const getWorkflowCanvasShadow = (isDark: boolean): string => {
  if (isDark) {
    // Inner shadow: X: 7, Y: -6, Blur: 30, Spread: 0, Color: #000000 with 32% opacity
    return "inset 7px -6px 30px 0px rgba(0, 0, 0, 0.32)";
  } else {
    // Table shadow: X: 1, Y: 4, Blur: 6, Spread: 0, Color: #2154EE with 10% opacity
    return "1px 4px 6px 0px rgba(33, 84, 238, 0.1)";
  }
};

/**
 * Get workflow canvas grid pattern color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Grid color
 */
export const getWorkflowGridColor = (isDark: boolean): string => {
  return isDark ? "#2B3946" : "#E3E6EB"; // Gray for light mode
};

/**
 * Get node border gradient colors (default/inactive)
 * @returns Object with gradient start and end colors
 */
export const getNodeBorderGradient = () => {
  return {
    start: "#9133EA", // Purple
    end: "#2962EB", // Blue
  };
};

/**
 * Get active/selected node border gradient colors
 * @returns Object with gradient start and end colors
 */
export const getActiveNodeBorderGradient = () => {
  return {
    start: "#48D8D1", // Cyan
    end: "#096DBF", // Darker blue
  };
};

/**
 * Get node drop shadow style
 * @returns Shadow style string
 */
export const getNodeDropShadow = (): string => {
  // Drop shadow: X: 0, Y: 2, Blur: 20, Spread: 0, Color: #6946EB with 18% opacity
  return "0px 2px 20px 0px rgba(105, 70, 235, 0.18)";
};

/**
 * Get node background color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Background color class
 */
export const getNodeBgColor = (isDark: boolean): string => {
  return isDark ? "bg-[#0C1116]" : "bg-white";
};

/**
 * Get node text color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Text color class
 */
export const getNodeTextColor = (isDark: boolean): string => {
  return isDark ? "text-white" : "text-[#162230]";
};

/**
 * Get port (handle) color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Port color class
 */
export const getPortColor = (isDark: boolean): string => {
  return isDark ? "bg-[#34C759]" : "bg-[#34C759]";
};

/**
 * Get context menu item class based on theme
 * @param isDark - Whether the theme is dark
 * @returns Context menu item class string
 */
export const getContextMenuItemClass = (isDark: boolean): string => {
  return `
    flex items-center justify-between w-full px-4 py-3 text-sm font-medium
    transition-colors duration-150 cursor-pointer
    ${
      isDark
        ? "text-white hover:bg-[#1E293B]"
        : "text-[#162230] hover:bg-[#F5F7FA]"
    }
    first:rounded-t-2xl last:rounded-b-2xl
  `;
};

/**
 * Get context menu separator class based on theme
 * @param isDark - Whether the theme is dark
 * @returns Context menu separator class string
 */
export const getContextMenuSeparatorClass = (isDark: boolean): string => {
  return `
    ${isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"}
    border-t
  `;
};

/**
 * Get react-select custom styles
 * @param isDark - Whether the theme is dark
 * @param hasError - Whether the select has an error
 * @returns React-select styles object
 */
export const getReactSelectStyles = (
  isDark: boolean,
  hasError: boolean = false
) => {
  return {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      borderColor: hasError ? "#EF4444" : "#D1D5DB",
      borderWidth: "1px",
      borderRadius: "12px",
      minHeight: "42px",
      maxHeight: "42px",
      boxShadow: "none",
      "&:hover": {
        borderColor: hasError ? "#EF4444" : "#9CA3AF",
      },
      ...(state.isFocused && {
        borderColor: hasError ? "#EF4444" : "#9CA3AF",
        boxShadow: "none",
      }),
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9CA3AF",
      fontSize: "14px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#111827",
      fontSize: "14px",
    }),
    input: (base: any) => ({
      ...base,
      color: "#111827",
      fontSize: "14px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: "#6B7280",
      padding: "8px",
      "&:hover": {
        color: "#4B5563",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "12px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "4px",
      zIndex: 9999,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "4px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#F3F4F6"
        : state.isFocused
        ? "#F9FAFB"
        : "#FFFFFF",
      color: "#111827",
      fontSize: "14px",
      padding: "10px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#F3F4F6",
      },
    }),
  };
};
