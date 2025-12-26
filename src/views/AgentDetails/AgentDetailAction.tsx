import Breadcrumb from "@/components/Breadcrumb";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector } from "@/store";
import { agentTabs } from "@/constants/tabs.contant";
import { getActiveTabLabel } from "@/utils/common";

const AgentDetailAction = () => {
  const { isDark } = useTheme();
  const { activeTab } = useAppSelector((state) => state.agent);

  return (
    <>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "Financial Agents", href: "/agents" },
            { label: getActiveTabLabel(agentTabs, activeTab) },
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
