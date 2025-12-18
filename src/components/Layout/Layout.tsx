import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LayoutRouteProps } from "react-router-dom";
import { useAppSelector } from "@/store";

const Layout: React.FC<LayoutRouteProps> = ({ children }) => {
  const { theme } = useAppSelector((state) => state.auth);

  return (
    <div
      className={`flex min-h-screen`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto mt-10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
