import AgentTabs from "./AgentsTabs";
import AgentDetailAction from "./AgentDetailAction";
import Workflows from "../Workflows";
import { useAppSelector } from "@/store";
import Users from "../Users";
import Conversations from "../Conversations";
import Files from "../Files";

const AgentDetails = () => {
  const { activeTab } = useAppSelector((state) => state.agent);

  return (
    <>
      <AgentDetailAction />
      <AgentTabs />
      {activeTab === "workflows" && <Workflows />}
      {activeTab === "users" && <Users />}
      {activeTab === "conversations" && <Conversations />}
      {activeTab === "files" && <Files />}
    </>
  );
};

export default AgentDetails;
