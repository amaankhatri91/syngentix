import React from "react";
import { Dialog } from "@/components/Dialog";
import { FooterButtons } from "@/components/FooterButtons";
import useTheme from "@/utils/hooks/useTheme";
import FileIcon from "@/assets/app-icons/FileIcon";

interface DeleteFileDialogProps {
  open: boolean;
  handler: () => void;
  onConfirm: () => void;
  fileName?: string;
  isLoading?: boolean;
}

const DeleteFileDialog: React.FC<DeleteFileDialogProps> = ({
  open,
  handler,
  onConfirm,
  fileName = "this file",
  isLoading = false,
}) => {
  const { isDark } = useTheme();

  const handleCancel = () => {
    handler();
  };

  const handleDelete = () => {
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      handler={handleCancel}
      size="sm"
      bodyClassName="!px-8 !pb-5"
    >
      <div className="flex flex-col items-center text-center pt-10">
        <div className="mb-4">
          <div
            className={`
              bg-gradient-to-r from-[#9133EA] to-[#2962EB] p-[5px]
              rounded-full
              flex-shrink-0
            `}
          >
            <div
              className={`${
                isDark ? "bg-[#0D131A]" : "bg-white"
              } rounded-full p-3`}
            >
              <FileIcon
                color={isDark ? "white" : undefined}
                useGradient={!isDark}
                size={40}
              />
            </div>
          </div>
        </div>

        <h3
          className={`text-xl font-semibold mb-3 ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          Delete File
        </h3>

        <p
          className={`text-base mb-2 ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          Are you sure you want to delete this file?
        </p>

        <p
          className={`text-sm mb-6 ${
            isDark ? "text-[#BDC9F5]" : "text-gray-600"
          }`}
        >
          This action cannot be undone. The file will be permanently removed
          from your agent.
        </p>

        <FooterButtons
          onCancel={handleCancel}
          onSubmit={handleDelete}
          cancelText="Cancel"
          submitText="Delete File"
          isLoading={isLoading}
          submitType="button"
          className="w-full"
        />
      </div>
    </Dialog>
  );
};

export default DeleteFileDialog;
