import { Card, CardBody } from "@material-tailwind/react";
import useTheme from "@/utils/hooks/useTheme";
import { stats } from "@/constants/navigation.constant";
import { Button } from "@/components/Button";


const DashboardCards = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats?.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className={`rounded-[10px] border bg-transparent shadow-none ${
                isDark
                  ? "border-[#2B3643]"
                  : "border-[#EEF4FF] shadow-[0_6px_18px_rgba(33,84,238,0.12)]"
              }`}
            >
              <CardBody className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full  flex items-center justify-center ${
                        isDark ? "bg-[#1C2643]" : "bg-[#F3F5F8]"
                      }`}
                    >
                      <IconComponent
                        color={isDark ? "white" : "#9133EA"}
                        size={22}
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

export default DashboardCards;
