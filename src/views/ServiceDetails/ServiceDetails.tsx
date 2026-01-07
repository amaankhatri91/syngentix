import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import useTheme from "@/utils/hooks/useTheme";
import { sampleServices } from "../Services/ServicesData";
import ServiceDetailsCard from "./ServiceDetailsCard";
import SecurityAccess from "./SecurityAccess";
import AllowedAgents from "./AllowedAgents";
import UserPermission from "./UserPermission";

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();

  const service = useMemo(() => sampleServices.find((s) => s.id === id), [id]);

  const handleAddAgent = useCallback(() => {
    console.log("Add agent clicked for service:", service?.id);
  }, [service?.id]);

  const handleSearchAgents = useCallback((searchTerm: string) => {
    console.log("Searching agents:", searchTerm);
  }, []);

  const handleAddPermission = useCallback(
    (userId: string, permissions: string[]) => {
      console.log("Add permission:", {
        userId,
        permissions,
        serviceId: service?.id,
      });
    },
    [service?.id]
  );

  const handleRemoveAgent = useCallback(
    (agentId: string) => {
      console.log("Remove agent:", { agentId, serviceId: service?.id });
    },
    [service?.id]
  );

  const handleEditPermission = useCallback(
    (id: string) => {
      console.log("Edit permission:", { id, serviceId: service?.id });
    },
    [service?.id]
  );

  const handleDeletePermission = useCallback(
    (id: string) => {
      console.log("Delete permission:", { id, serviceId: service?.id });
    },
    [service?.id]
  );

  const breadcrumbItems = useMemo(
    () =>
      service
        ? [{ label: "Services", href: "/services" }, { label: service.name }]
        : [{ label: "Services", href: "/services" }],
    [service]
  );

  if (!service) {
    return (
      <div
        className={`text-center py-8 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <hr
        className={`border-t mb-6 ${
          isDark ? "border-[#2B3643]" : "border-[#DFE1E8]"
        }`}
      />

      <div className="mb-8">
        <ServiceDetailsCard service={service} />
      </div>

      <div className="mb-8">
        <SecurityAccess
          onAddAgent={handleAddAgent}
          onSearchAgents={handleSearchAgents}
          onAddPermission={handleAddPermission}
        />
      </div>

      <div className="mb-8">
        <AllowedAgents onRemoveAgent={handleRemoveAgent} />
      </div>

      <div>
        <UserPermission
          onEdit={handleEditPermission}
          onDelete={handleDeletePermission}
        />
      </div>
    </>
  );
};

export default ServiceDetails;
