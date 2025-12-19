import SignIn from "@/views/Auth/SignIn";
import Dashboard from "@/views/Dashboard";
import Agents from "@/views/Agents";
import Users from "@/views/Users";
import Templates from "@/views/Templates";
import Settings from "@/views/Settings";
import Profile from "@/views/Profile";

// Define routes
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/agents", component: Agents },
  { path: "/users", component: Users },
  { path: "/templates", component: Templates },
  { path: "/settings", component: Settings },
  { path: "/profile", component: Profile },
];

const publicRoutes = [
  { path: "/sigin-in", component: SignIn },
];

export { authProtectedRoutes, publicRoutes };
