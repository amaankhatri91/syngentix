import React from "react";
import useTheme from "@/utils/hooks/useTheme";

export interface TabItem {
  label: string;
  value: string | number;
}

export interface TabsProps {
  /**
   * Array of tab items to display
   */
  tabs: TabItem[];
  /**
   * Currently active tab value
   */
  activeTab: string | number;
  /**
   * Callback function when a tab is clicked
   */
  onTabChange: (value: string | number) => void;
  /**
   * Additional CSS classes for the tab container
   */
  className?: string;
  /**
   * Additional CSS classes for individual tab items
   */
  tabClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  tabClassName = "",
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        // Active tab styles (same for both dark and light mode)
        const activeStyles = isActive
          ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB] border-0 text-white"
          : "";
        // Non-active tab styles
        const inactiveStyles = !isActive
          ? isDark
            ? "bg-[#0C1116] border border-[#394757] text-white"
            : "bg-[#F5F7FA] border border-[#E3E6EB] text-[#162230]"
          : "";
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`
              rounded-2xl
              px-4
              py-2
              transition-all
              duration-200
              ${activeStyles}
              ${inactiveStyles}
              ${tabClassName}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
