import { useState } from "react";
import { Button } from "@/components/Button";
import Add from "@/assets/app-icons/Add";
import useTheme from "@/utils/hooks/useTheme";
import { useParams } from "react-router-dom";
import AddFileDialog from "./AddFileDialog";

const FilesActionBar = () => {
  const { isDark } = useTheme();
  const { agentId } = useParams<{ agentId?: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="mb-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[18px]">Files</h2>
          <Button
            onClick={handleOpenDialog}
            icon={<Add />}
            className="px-4 !py-1.5 !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
          >
            Add Files
          </Button>
        </div>
        {isDark && !agentId && <hr className="border-t border-[#2B3643]" />}
      </div>
      <AddFileDialog open={isDialogOpen} handler={handleCloseDialog} />
    </>
  );
};

export default FilesActionBar;
