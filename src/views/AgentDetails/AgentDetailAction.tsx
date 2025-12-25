import Breadcrumb from "@/components/Breadcrumb";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector } from "@/store";
import { agentTabs } from "@/constants/tabs.contant";

const AgentDetailAction = () => {
  const { isDark } = useTheme();
  const { activeTab } = useAppSelector((state) => state.agent);

  // Find the active tab label
  const activeTabLabel =
    agentTabs.find((tab) => tab.value === activeTab)?.label || "Workflows";

  return (
    <>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Financial Agents", href: "/financial-agents" },
            { label: activeTabLabel },
          ]}
        />
      </div>
      <hr
        className={`border-t ${
          isDark ? "border-[#2B3643]" : "border-[#DFE1E8]"
        }`}
      />
    </>
  );
};

export default AgentDetailAction;
