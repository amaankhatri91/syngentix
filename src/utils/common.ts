import { TabItem } from "@/components/Tabs";

export const getActiveTabLabel = (
  tabs: TabItem[],
  activeTab: string | number,
  fallback = "Workflows"
): string => {
  return tabs.find((tab) => String(tab.value) === String(activeTab))?.label ?? fallback;
};
