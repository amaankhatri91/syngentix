import AgentDialog from "./AgentDialog";
import AgentList from "./AgentList";
import AgentsAction from "./AgentsAction";
import AgentDeleteDialog from "./AgentDeleteDialog";

const Agents = () => {
  return (
    <>
      <AgentDialog />
      <AgentDeleteDialog />
      <AgentsAction />
      <AgentList />
    </>
  );
};

export default Agents;
