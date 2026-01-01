import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LayoutRouteProps, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";

const Layout: React.FC<LayoutRouteProps> = ({ children }) => {
  const { sidebarOpen } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // ✅ show header only on dashboard
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-56" : "lg:ml-16"
        }`}
      >
        {/* Header (Dashboard only) */}
        {/* {isDashboard && <Header />} */}
        {isDashboard && <Header />}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto px-6 py-4 ${
            isDashboard ? "mt-16" : "mt-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
