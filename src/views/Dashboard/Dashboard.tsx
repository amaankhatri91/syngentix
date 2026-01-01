import { Card, CardBody } from "@material-tailwind/react";
import useTheme from "@/utils/hooks/useTheme";
import { stats } from "@/constants/navigation.constant";
import addAgent from "@/assets/icons/add-agent.svg";
import { Button } from "@/components/Button";
import Add from "@/assets/app-icons/Add";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAgentDailog } from "@/store/agent/agentSlice";
import { useGetAgentsQuery } from "@/services/RtkQueryService";
import Agents from "../Agents/Agents";

const Dashboard = () => {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { workspace, token } = useAppSelector((state) => state.auth);

  const { data }: any = useGetAgentsQuery(workspace?.id, {
    skip: !token || !workspace?.id,
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats?.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className={`rounded-[10px] border bg-transparent shadow-none ${
                isDark
                  ? "border-[#2B3643]"
                  : "border-[#EEF4FF] shadow-[0_6px_18px_rgba(33,84,238,0.12)]"
              }`}
            >
              <CardBody className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full  flex items-center justify-center ${
                        isDark ? "bg-[#1C2643]" : "bg-[#F3F5F8]"
                      }`}
                    >
                      <IconComponent
                        color={isDark ? "white" : "#9133EA"}
                        size={22}
                      />
                    </div>
                    <span className="text-base font-normal">{stat.title}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
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
    </div>
  );
};

export default Dashboard;
