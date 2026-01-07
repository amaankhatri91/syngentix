export interface Workflow {
  id: string;
  workflow_id?: string;
  title: string;
  description: string;
  type?: string;
  agent_id?: string;
  creator_id?: string;
  workspace_id?: string;
  status?: boolean | string;
  workflow_socket_id?: string | null;
  graph?: any;
  copied_from_agent_id?: string | null;
  copied_from_workflow_id?: string | null;
  created_at?: string;
  updated_at?: string;
  last_run_date_time?: string | null;
  owner_name?: string;
  deleted_at?: string | null;
  triggers_count?: number;
  actions_count?: number;
  last_run_at?: string | null;
  last_run_status?: string | null;
  // Legacy fields for backward compatibility
  triggers?: number;
  actions?: number;
  schedule?: string;
  isActive?: boolean;
  owner?: string;
  last_run?: string;
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

