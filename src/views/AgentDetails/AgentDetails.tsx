import AgentTabs from "./AgentsTabs";
import AgentDetailAction from "./AgentDetailAction";
import Workflows from "../Workflows";
import { useAppSelector } from "@/store";
import Users from "../Users";

const AgentDetails = () => {
  const { activeTab } = useAppSelector((state) => state.agent);

  return (
    <>
      <AgentDetailAction />
      <AgentTabs />
      {activeTab === "workflows" && <Workflows />}
      {activeTab === "users" && <Users />}
    </>
  );
};

export default AgentDetails;
