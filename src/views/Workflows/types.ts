export interface Workflow {
  id: string;
  workflow_id?: string;
  title: string;
  description: string;
  triggers?: number;
  actions?: number;
  schedule?: string;
  status?: boolean;
  isActive?: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WorkflowsResponse {
  status: string;
  message: string;
  data: Workflow[];
  pagination: PaginationMeta;
}

export interface WorkflowFormValues {
  title: string;
  description: string;
}

export interface WorkflowDialogProps {
  open: boolean;
  handler: () => void;
  onCreate?: (data: { workflowName: string; description: string }) => void;
}

