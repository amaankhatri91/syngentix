import { useGetAgentsQuery } from "@/services/RtkQueryService";
import { useAppDispatch, useAppSelector } from "@/store";
import Agents from "../Agents/Agents";
import { Button } from "@/components/Button";
import addAgent from "@/assets/icons/add-agent.svg";
import { setAgentDailog } from "@/store/agent/agentSlice";
import { Add } from "@/assets/app-icons";

const DashboardAgents = () => {
  const dispatch = useAppDispatch();
  const { workspace, token } = useAppSelector((state) => state.auth);
  const { data }: any = useGetAgentsQuery(workspace?.id, {
    skip: !token || !workspace?.id,
  });

  return (
    <>
      {data?.data?.length < 0 ? (
        <div className="flex flex-col items-center h-[60vh] justify-center mt-12">
          <div className="mb-4">
            <img src={addAgent} className="h-16" alt="" />
          </div>
          <h2 className="text-xl font-semibold  mb-2">No Agent Found</h2>
          <p>Create New Agent</p>
          <Button
            onClick={() => {
              dispatch(
                setAgentDailog({
                  agentDailog: true,
                  agentRow: {},
                })
              );
            }}
            icon={<Add size={18} />}
            className="px-5 py-2.5 mt-4 rounded-xl !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
          >
            Create Agent
          </Button>
        </div>
      ) : (
        <div className="mt-5">
          <Agents />
        </div>
      )}
    </>
  );
};

export default DashboardAgents;
