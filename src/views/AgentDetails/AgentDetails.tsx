import AgentTabs from "./AgentsTabs";
import AgentDetailAction from "./AgentDetailAction";
import Workflows from "../Workflows";

const AgentDetails = () => {
  return (
    <>
      <AgentDetailAction />
      <AgentTabs />
      <Workflows />
    </>
  );
};

export default AgentDetails;
