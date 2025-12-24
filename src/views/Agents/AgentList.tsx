import AgentDialog from "./AgentDialog";
import AgentsAction from "./AgentsAction";
import Agents from "./Agents";

const AgentList = () => {
  return (
    <div>
      <AgentDialog />
      <AgentsAction />
      <Agents />
    </div>
  );
};

export default AgentList;
