import React from "react";
import { Card, CardBody } from "@material-tailwind/react";
import useTheme from "@/utils/hooks/useTheme";
import StatusBadge from "@/components/DataTable/StatusBadge";
import EnvelopeIcon from "@/assets/app-icons/EnvelopeIcon";
import CalendarIcon from "@/assets/app-icons/CalendarIcon";
import FooterButtons from "@/components/FooterButtons/FooterButtons";
import { sampleUsers } from "./UsersData";
import { User } from "./types";

const UsersCards: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className="
        grid
        mt-16
        gap-x-6
        gap-y-14 sm:gap-y-16
        [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]
      "
    >
      {sampleUsers?.map((user: User) => (
        <Card
          key={user.id}
          className={`relative pt-16 rounded-[18px] overflow-visible ${
            isDark
              ? "bg-[#0F1724] border border-[#1E2A3A]"
              : "bg-white border border-[#EEF4FF]"
          }`}
        >
          {/* Avatar */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
            <div
              className={`w-20 h-20 rounded-full p-[3px] ${
                isDark ? "bg-[#1C2643]" : "bg-[#F5F7FA]"
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover bg-black"
              />
            </div>
          </div>
          <CardBody className="text-center px-4 pb-5 pt-0">
            {/* Name + Role */}
            <div className="flex gap-2 justify-center mb-3 items-center flex-wrap">
              <h5 className="font-semibold">{user.name}</h5>
              <p className="text-sm ">({user.role})</p>
            </div>
            {/* Status */}
            <div className="flex justify-center mb-5">
              <StatusBadge
                className="text-[14px]"
                status={{
                  label: user.status === "active" ? "Active" : "Inactive",
                  variant: user.status === "active" ? "active" : "offline",
                }}
              />
            </div>
            {/* Email */}
            <h5 className="flex items-center justify-start gap-2 text-sm mb-2">
              <EnvelopeIcon size={16} color="currentColor" />
              {user.email}
            </h5>
            {/* Join Date */}
            <div
              className={`flex items-center justify-start gap-2 text-sm mb-5 ${
                isDark ? "text-slate-300" : "text-gray-600"
              }`}
            >
              <CalendarIcon size={16} />
              <span>Joined on</span>
              <h5>{user.joinDate}</h5>
            </div>
            {/* Actions */}
            <FooterButtons
              cancelText="Inactive"
              submitText="Remove"
              showCancel
              showSubmit
              className="!justify-between !pt-2 [&_button]:!flex-1 gap-3"
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default UsersCards;
