import React from "react";
import Tabs from "@/components/Tabs";
import { agentTabs } from "@/constants/tabs.contant";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/agent/agentSlice";

const AgentTabs = () => {
  const { activeTab } = useAppSelector((state) => state.agent);
  const dispatch = useAppDispatch();

  const handleTabChange = (value: string | number) => {
    dispatch(setActiveTab(value));
  };

  return (
    <div className="mt-4 mb-5">
      <Tabs
        tabs={agentTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabClassName="py-2"
      />
    </div>
  );
};

export default AgentTabs;
