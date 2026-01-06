import SignIn from "@/views/Auth/SignIn";
import Dashboard from "@/views/Dashboard";
import Agents from "@/views/Agents";
import Users from "@/views/Users";
import Templates from "@/views/Templates";
import Settings from "@/views/Settings";
import Profile from "@/views/Profile";
import AgentDetails from "@/views/AgentDetails";
import Workflows from "@/views/Workflows";
import WorkflowEditor from "@/views/WorkflowEditor";

// Define routes
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/agents", component: Agents },
  { path: "/agents/:agentId", component: AgentDetails },
  {
    path: "/agent/:agentId/workflow/:workflowId",
    component: WorkflowEditor,
  },
  { path: "/users", component: Users },
  { path: "/templates", component: Templates },
  { path: "/settings", component: Settings },
  { path: "/profile", component: Profile },
  { path: "/workflows", component: Workflows },
];

const publicRoutes = [
  { path: "/sigin-in", component: SignIn },
  { path: "/sigin-up", component: SignIn },
];

export { authProtectedRoutes, publicRoutes };
