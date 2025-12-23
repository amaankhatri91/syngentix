import React from "react";
import { Card, CardBody } from "@material-tailwind/react";
import { useAppSelector } from "@/store";
import { stats } from "@/constants/navigation.constant";

const Dashboard = () => {
  const { theme } = useAppSelector((state) => state.auth);
 
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats?.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className={`rounded-[10px] border bg-transparent shadow-none ${
                theme === "dark" ? "border-[#2B3643]" : "border-[#EEF4FF] shadow-[0_6px_18px_rgba(33,84,238,0.12)]"
              }`}
            >
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full  flex items-center justify-center ${
                        theme === "dark" ? "bg-[#1C2643]" : "bg-[#F3F5F8]"
                      }`}
                    >
                      <IconComponent
                        color={theme === "dark" ? "white" : "#9133EA"}
                        size={24}
                      />
                    </div>
                    <span className="text-base font-normal">{stat.title}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
