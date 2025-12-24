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
            className={`rounded-[10px] border bg-transparent shadow-none relative ${
              isDark
                ? "border-[#2B3643]"
                : "border-[#EEF4FF] shadow-[0_6px_18px_rgba(33,84,238,0.12)]"
            }`}
          >
            <CardBody
              className={`p-4 ${
                isDark
                  ? index === 0
                    ? "bg-[#0D131A] rounded-[10px]"
                    : "bg-[#0D131A]"
                  : "bg-white"
              }`}
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4 -mt-2">
                <div
                  className={`relative ${
                    isDark && index === 0
                      ? "ring-2 ring-offset-2 ring-offset-[#0D131A] ring-gradient-to-r from-[#9133ea] to-[#2962eb]"
                      : ""
                  }`}
                  style={
                    isDark && index === 0
                      ? {
                          background:
                            "linear-gradient(90deg, #9133ea 0%, #2962eb 100%)",
                          borderRadius: "50%",
                          padding: "2px",
                        }
                      : undefined
                  }
                >
                  <div
                    className={`w-16 h-16 rounded-full ${
                      isDark ? "bg-[#1C2643]" : "bg-[#F3F5F8]"
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
