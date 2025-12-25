export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggers: number;
  actions: number;
  schedule: string;
  status: string;
  isActive: boolean;
}

export type WorkflowsResponse = Workflow[];

export interface WorkflowFormValues {
  title: string;
  description: string;
}

export interface WorkflowDialogProps {
  open: boolean;
  handler: () => void;
  onCreate?: (data: { workflowName: string; description: string }) => void;
}

