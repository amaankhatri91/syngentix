import Breadcrumb from "@/components/Breadcrumb";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector } from "@/store";
import { agentTabs } from "@/constants/tabs.contant";
import { getActiveTabLabel } from "@/utils/common";
import { useParams } from "react-router-dom";
import { useGetAgentsQuery } from "@/services/RtkQueryService";
import { Agent } from "@/views/Agents/types";

const AgentDetailAction = () => {
  const { isDark } = useTheme();
  const { activeTab } = useAppSelector((state) => state.agent);
  const { agentId } = useParams<{ agentId: string }>();
  const { workspace, token } = useAppSelector((state) => state.auth);
  const { data: agentsData }: any = useGetAgentsQuery(workspace?.id, {
    skip: !token || !workspace?.id,
  });

  // Find the current agent by agent_id
  const currentAgent = agentsData?.data?.find(
    (agent: Agent) => agent.agent_id === agentId
  );
  const agentName = currentAgent?.name || "Financial Agents";

  return (
    <>
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: agentName, href: "/agents" },
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
