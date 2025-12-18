import SignIn from "@/views/Auth/SignIn";
import Dashboard from "@/views/Dashboard";

// Define routes
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
];

const publicRoutes = [
  { path: "/sigin-in", component: SignIn },
];

export { authProtectedRoutes, publicRoutes };
