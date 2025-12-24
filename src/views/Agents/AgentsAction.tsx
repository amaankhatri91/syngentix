import { Button } from "@/components/Button";
import Add from "@/components/Icons/Add";
import useTheme from "@/utils/hooks/useTheme";
import React from "react";

const AgentsAction = () => {
  const { isDark } = useTheme();
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-3">
        <h2>Agents</h2>
        <Button
          icon={<Add />}
          className="px-4 !py-1.5 !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
        >
          Create Agent
        </Button>
      </div>
      {isDark && <hr className="border-t border-[#2B3643]" />}
    </div>
  );
};

export default AgentsAction;
