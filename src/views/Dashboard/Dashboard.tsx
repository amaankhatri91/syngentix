import React from "react";
import DashboardCards from "./DashboardCards";
import DashboardAgents from "./DashboardAgents";
import AgentDialog from "../Agents/AgentDialog";

const Dashboard = () => {
  return (
    <>
      <DashboardCards />
      <AgentDialog />
      <DashboardAgents />
    </>
  );
};

export default Dashboard;
