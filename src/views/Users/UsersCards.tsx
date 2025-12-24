import React from "react";
import { Card, CardBody } from "@material-tailwind/react";
import { User } from "./types";
import { sampleUsers } from "./UsersData";
import useTheme from "@/utils/hooks/useTheme";
import StatusBadge from "@/components/DataTable/StatusBadge";
import EnvelopeIcon from "@/components/Icons/EnvelopeIcon";
import CalendarIcon from "@/components/Icons/CalendarIcon";
import FooterButtons from "@/components/FooterButtons/FooterButtons";

const UsersCards: React.FC = () => {
  const { isDark } = useTheme();

  const handleInactive = (user: User) => {
    console.log("Inactive clicked for:", user);
    // Handle inactive action
  };

  const handleRemove = (user: User) => {
    console.log("Remove clicked for:", user);
    // Handle remove action
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {sampleUsers.map((user, index) => (
          <Card
            key={user.id}
            className={`rounded-[16px]  relative ${
              isDark ? "border border-[#2B3643]" : "border border-[#EEF4FF]"
            }`}
          >
            <CardBody
              className={`p-4 ${
                isDark
                  ? "bg-[#0F1724] rounded-[14px]"
                  : "bg-[#FFFFFF] rounded-[14px]"
              }`}
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4 -mt-2">
                <div className={`relative`}>
                  <div
                    className={`w-20 h-20 rounded-full p-1 ${
                      isDark ? "bg-[#1C2643] " : "bg-[#F5F7FA]"
                    } flex items-center justify-center overflow-hidden`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Name and Role */}
              <div className="text-center mb-3">
                <h5 className="font-medium mb-1">{user.name}</h5>
                <span className="text-sm opacity-70">({user.role})</span>
              </div>
              {/* Status */}
              <div className="flex justify-center mb-4">
                <StatusBadge
                  status={{
                    label: user.status === "active" ? "Active" : "Inactive",
                    variant: user.status === "active" ? "active" : "offline",
                  }}
                />
              </div>
              {/* Email */}
              <div className="flex items-center gap-2 mb-2">
                <EnvelopeIcon
                  color={isDark ? "#BDC9F5" : "#5A5A5A"}
                  size={16}
                />
                <span className="text-sm">{user.email}</span>
              </div>
              {/* Join Date */}
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon
                  color={isDark ? "#BDC9F5" : "#5A5A5A"}
                  size={16}
                />
                <span className="text-sm">Joined on {user.joinDate}</span>
              </div>
              {/* Footer Buttons */}
              <FooterButtons
                onCancel={() => handleInactive(user)}
                onSubmit={() => handleRemove(user)}
                cancelText="Inactive"
                submitText="Remove"
                showCancel={true}
                showSubmit={true}
                className="!justify-between !pt-2 [&_button]:!w-auto [&_button]:!flex-1"
                submitType="button"
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersCards;
