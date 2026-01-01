import { Button } from "@/components/Button";
import Add from "@/assets/app-icons/Add";
import { useAppDispatch } from "@/store";
import { setWorkflowDialog } from "@/store/workflow/workflowSlice";

const WorkflowsAction = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[18px]">Workflow</h2>
        <Button
          onClick={() => {
            dispatch(
              setWorkflowDialog({
                workflowDialog: true,
                workflowRow: {},
              })
            );
          }}
          icon={<Add size={18} />}
          className="px-3 !py-2 !rounded-xl !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb]"
        >
          Create Workflow
        </Button>
      </div>
    </div>
  );
};

export default WorkflowsAction;
