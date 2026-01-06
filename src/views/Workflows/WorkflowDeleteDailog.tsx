import React from "react";
import { Dialog } from "@/components/Dialog";
import { FooterButtons } from "@/components/FooterButtons";
import useTheme from "@/utils/hooks/useTheme";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setDeleteDialog,
  deleteWorkflow,
} from "@/store/workflow/workflowSlice";
import useRefetchQueries from "@/utils/hooks/useRefetchQueries";

const WorkflowDeleteDialog: React.FC = () => {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { invalidateAllQueries } = useRefetchQueries();
  const { deleteDialog, deleteWorkflowRow, isDeleting } = useAppSelector(
    (state) => state.workflow
  );

  const handleCancel = () => {
    dispatch(
      setDeleteDialog({
        deleteDialog: false,
        deleteWorkflowRow: {},
      })
    );
  };

  const handleDelete = async () => {
    // if (deleteWorkflowRow?.workflow_id || deleteWorkflowRow?.id) {
    //   try {
    //     await dispatch(
    //       deleteWorkflow(
    //         deleteWorkflowRow?.workflow_id || deleteWorkflowRow?.id
    //       )
    //     ).unwrap();
    //     invalidateAllQueries();
    //   } catch (error: any) {
    //     console.log(error, "Delete Workflow Error");
    //   }
    // }
  };

  const workflowName =
    deleteWorkflowRow?.title || deleteWorkflowRow?.name || "this workflow";

  return (
    <Dialog
      open={deleteDialog}
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
                isDark ? "bg-[#1C2643]" : "bg-white"
              } rounded-full p-4`}
            >
              <DeleteIcon
                color={isDark ? "white" : undefined}
                theme={isDark ? "dark" : "light"}
                height={32}
                useGradient={!isDark}
              />
            </div>
          </div>
        </div>

        <h3
          className={`text-xl font-semibold mb-3 ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          Delete Workflow
        </h3>

        <h5 className={`text-base mb-2`}>
          Are you sure you want to delete {workflowName}?
        </h5>

        <p
          className={`text-sm mb-4 ${
            isDark ? "text-[#BDC9F5]" : "text-[#848A94]"
          }`}
        >
          This action cannot be undone. The workflow will be permanently removed
          from your agent.
        </p>
        <FooterButtons
          onCancel={handleCancel}
          onSubmit={handleDelete}
          cancelText="Cancel"
          submitText="Delete Workflow"
          isLoading={isDeleting}
          submitType="button"
          className="w-full"
        />
      </div>
    </Dialog>
  );
};

export default WorkflowDeleteDialog;
