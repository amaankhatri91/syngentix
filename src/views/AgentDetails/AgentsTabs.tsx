import React, { useState } from "react";
import Tabs from "@/components/Tabs";
import { agentTabs } from "@/constants/tabs.contant";

const AgentTabs = () => {
  const [activeTab, setActiveTab] = useState<string | number>(
    agentTabs[0]?.value
  );

  return (
    <div className="mt-3">
      <Tabs tabs={agentTabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AgentTabs;
