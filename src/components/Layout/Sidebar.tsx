import React, { createElement } from "react";
import { useAppSelector } from "@/store";
import { finalytixLogoSmall, siginLogo } from "@/utils/logoUtils";
import useAuth from "@/utils/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { menuItems, settingItems } from "@/constants/navigation.constant";

const Sidebar: React.FC = () => {
  const { theme, sidebarOpen } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getIconColor = (path: string) => {
    if (isActive(path)) {
      return "white";
    }
    return theme === "dark" ? "#BDC9F5" : "#646567";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-20 transition-all duration-300 hidden lg:block ${
        sidebarOpen ? "w-56" : "w-16"
      } ${
        theme === "dark"
          ? "bg-[#0C1116] border-r border-[#0B1739]"
          : "bg-[#F5F7FA] border-r border-[#E3E6EB]"
      }`}
    >
      <div className="flex flex-col h-full">
        <div
          className={` flex ${
            sidebarOpen ? "justify-start p-6" : "justify-center p-4"
          }`}
        >
          {sidebarOpen ? (
            <img
              src={siginLogo(theme)}
              alt="Logo"
              className="h-[75px] w-auto"
            />
          ) : (
            <img
              src={finalytixLogoSmall(theme)}
              alt="Logo"
              className="h-12 w-12 object-contain"
            />
          )}
        </div>
        <nav
          className={`flex-1 space-y-2 overflow-y-auto ${
            sidebarOpen ? "px-5" : "px-2"
          }`}
        >
          {menuItems?.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center text-md rounded-lg transition-[background-color,color] duration-200 ${
                sidebarOpen ? "justify-between px-4" : "justify-center px-2"
              } py-2 ${
                isActive(item.path)
                  ? theme === "dark"
                    ? "text-white sidebar-active-dark"
                    : "text-white sidebar-active-light"
                  : theme === "dark"
                  ? "text-[#BDC9F5] hover:bg-[#1E293B]"
                  : "text-[#646567] hover:bg-gray-100"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div
                className={`flex items-center ${sidebarOpen ? "gap-3" : ""}`}
              >
                {createElement(item?.icon, {
                  color: getIconColor(item?.path),
                  size: 20,
                })}
                {sidebarOpen && (
                  <span
                    className={`font-medium ${
                      isActive(item?.path)
                        ? theme === "dark"
                          ? "text-white"
                          : "text-white"
                        : theme === "dark"
                        ? "text-[#BDC9F5] hover:bg-[#1E293B]"
                        : "text-[#646567] hover:bg-gray-100"
                    }`}
                  >
                    {item?.label}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
        <hr
          className={`${sidebarOpen ? "mx-4" : "mx-2"} ${
            theme === "dark" ? "border-[#2B3643]" : "border-[#DFE1E8]"
          }`}
        />
        <div className="py-4">
          <nav
            className={`flex-1 space-y-2 overflow-y-auto ${
              sidebarOpen ? "px-5" : "px-2"
            }`}
          >
            {settingItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => {
                  if (item.label === "Logout") {
                    signOut();
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center text-md rounded-lg transition-[background-color,color] duration-200 ${
                  sidebarOpen ? "justify-between px-4" : "justify-center px-2"
                } py-2 ${
                  isActive(item.path)
                    ? theme === "dark"
                      ? "text-white sidebar-active-dark"
                      : "text-white sidebar-active-light"
                    : theme === "dark"
                    ? "text-[#BDC9F5] hover:bg-[#1E293B]"
                    : "text-[#646567] hover:bg-gray-100"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div
                  className={`flex items-center ${sidebarOpen ? "gap-3" : ""}`}
                >
                  {createElement(item.icon, {
                    color: getIconColor(item.path),
                    size: 20,
                  })}
                  {sidebarOpen && (
                    <span
                      className={`font-medium ${
                        isActive(item.path)
                          ? theme === "dark"
                            ? "text-white"
                            : "text-white"
                          : theme === "dark"
                          ? "text-[#BDC9F5] hover:bg-[#1E293B]"
                          : "text-[#646567] hover:bg-gray-100"
                      }`}
                    >
                      {item?.label}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
