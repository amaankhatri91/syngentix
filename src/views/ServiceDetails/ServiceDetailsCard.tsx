import React from "react";
import useTheme from "@/utils/hooks/useTheme";
import { Service } from "../Services/types";

interface ServiceDetailsCardProps {
  service: Service;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
  const { isDark } = useTheme();

  const cardStyles = isDark
    ? {
        border: "0.6px solid #2B3643",
        opacity: 1,
      }
    : {
        border: "0.6px solid #EEF4FF",
        boxShadow: "1px 4px 6px 0px #2154EE1A",
      };

  const labelClass = `text-sm ${isDark ? "text-[#BDC9F5]" : "text-[#646567]"}`;
  const valueClass = `text-sm font-medium ${
    isDark ? "text-white" : "text-[#162230]"
  }`;

  const fields = [
    { label: "Service Name", value: service.name },
    { label: "Username", value: service.username },
    { label: "Hostname", value: service.host },
    { label: "Port", value: service.port },
    { label: "Connection Name", value: service.connectionName || "-" },
    { label: "Service Type", value: service.serviceType },
    { label: "Security SSL", value: service.securitySSL || "-" },
  ];

  return (
    <>
      <h2
        className={`text-xl font-medium mb-6 ${
          isDark ? "text-white" : "text-[#162230]"
        }`}
      >
        Service Details
      </h2>

      <div
        className={`${
          isDark ? "bg-[#0F1724]" : "bg-white"
        } rounded-2xl p-6  transition-all duration-200`}
        style={cardStyles}
      >
        <div className="flex justify-between items-center w-full">
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1 min-w-0">
              <span className={labelClass}>{field.label}</span>
              <span className={valueClass}>{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetailsCard;
