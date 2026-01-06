import React from "react";
import ServiceCard from "./ServiceCard";
import { sampleServices } from "./ServicesData";
import { Service } from "./types";

const ServicesList: React.FC = () => {
  const handleViewDetails = (id: string) => {
    console.log("View details for service:", id);
  };

  const handleTestService = (id: string) => {
    console.log("Test service:", id);
  };

  const handleMenuClick = (id: string, action: string) => {
    console.log("Menu action:", action, "for service:", id);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sampleServices.map((service: Service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onViewDetails={handleViewDetails}
          onTestService={handleTestService}
          onMenuClick={handleMenuClick}
        />
      ))}
    </div>
  );
};

export default ServicesList;
