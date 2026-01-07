import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "./types";
import useTheme from "@/utils/hooks/useTheme";
import { Button } from "@/components/Button";
import { MenuDotsVerticalIcon } from "@/assets/app-icons";

interface ServiceCardProps {
  service: Service;
  onViewDetails?: (id: string) => void;
  onTestService?: (id: string) => void;
  onMenuClick?: (id: string, action: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails,
  onTestService,
  onMenuClick,
}) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleViewDetails = () => {
    onViewDetails?.(service.id);
    navigate(`/services/${service.id}`);
  };

  const handleTestService = () => {
    onTestService?.(service.id);
  };

  const handleMenuAction = (action: string) => {
    setMenuOpen(false);
    onMenuClick?.(service.id, action);
  };

  return (
    <div
      className={`relative ${
        isDark ? "bg-[#0F1724]" : "bg-white"
      } rounded-2xl p-4 transition-all duration-200 ${
        isDark ? "hover:shadow-lg" : ""
      }`}
      style={
        isDark
          ? {
              border: "0.6px solid #2B3643",
              opacity: 1,
            }
          : {
              border: "0.6px solid #EEF4FF",
              boxShadow: "1px 4px 6px 0px #2154EE1A",
            }
      }
    >
      <div className="absolute top-4 right-4 z-20" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`p-1 rounded ${
            isDark ? "hover:bg-[#1E293B]" : "hover:bg-gray-100"
          } transition-colors`}
          aria-label="Menu"
        >
          <MenuDotsVerticalIcon
            color={isDark ? "#BDC9F5" : "#646567"}
            size={16}
          />
        </button>

        {menuOpen && (
          <div
            className={`absolute right-0 mt-2 w-40 rounded-xl shadow-lg z-30 ${
              isDark
                ? "bg-[#0C1116] border border-[#394757]"
                : "bg-white border border-[#E3E6EB]"
            }`}
          >
            <button
              onClick={() => handleMenuAction("edit")}
              className={`w-full text-left px-4 py-2 text-sm rounded-t-xl ${
                isDark
                  ? "hover:bg-[#1E293B] text-white"
                  : "hover:bg-gray-100 text-[#162230]"
              } transition-colors`}
            >
              Edit
            </button>
            <div
              className={`${
                isDark ? "border-[#394757]" : "border-[#E3E6EB]"
              } border-t`}
            />
            <button
              onClick={() => handleMenuAction("delete")}
              className={`w-full text-left px-4 py-2 text-sm rounded-b-xl ${
                isDark
                  ? "hover:bg-[#1E293B] text-white"
                  : "hover:bg-gray-100 text-[#162230]"
              } transition-colors`}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 pr-8">
        <h3 className={`text-base ${isDark ? "text-white" : "text-[#162230]"}`}>
          <span
            className={`font-medium leading-[14px] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {service.name}
          </span>{" "}
          <span className="font-normal opacity-70">
            ({service.serviceType})
          </span>
        </h3>
      </div>

      <div
        className={`mb-4 ${
          isDark ? "border-[#2B3643]" : "border-[#EEF4FF]"
        } border-t`}
      />

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-[#BDC9F5]" : "text-[#646567]"
            }`}
          >
            Username
          </span>
          <span
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            {service.username}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-[#BDC9F5]" : "text-[#646567]"
            }`}
          >
            Host
          </span>
          <span
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            {service.host}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              isDark ? "text-[#BDC9F5]" : "text-[#646567]"
            }`}
          >
            Port
          </span>
          <span
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-[#162230]"
            }`}
          >
            {service.port}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={handleViewDetails}
          className={`flex-1 !rounded-xl !py-2 ${
            isDark
              ? "!bg-[#1E293B] hover:!bg-[#2B3643] text-white border border-[#2B3643]"
              : "!bg-[#E6E6E6] hover:!bg-gray-300 text-gray-900"
          }`}
        >
          View Details
        </Button>
        <Button
          onClick={handleTestService}
          className="flex-1 !rounded-xl !py-2 !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-white"
        >
          Test Service
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
