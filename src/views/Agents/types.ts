// API Response type - matches the actual API response structure
export interface Agent {
  id: string;
  name: string;
  description: string;
  apply_input_guardrails: boolean;
  apply_output_guardrails: boolean;
  workspace_id: string | null;
  type: string;
  agent_id: string;
  creator_id: string;
  workflows: string[];
  users?: string;
  files?: string;
  status?: string | boolean;
}

// API Response type - array of agents
export type AgentsResponse = Agent[];

// Sample data type (for UI display if needed)
export interface FinancialAgent {
  id: string;
  name: string;
  workflows: number;
  conversations: number;
  users: number;
  files: number;
  status: "active" | "offline";
}

export interface AgentDialogProps {
  open: boolean;
  handler: () => void;
  onCreate?: (data: { agentName: string; description: string }) => void;
}

export interface AgentFormValues {
  agentName: string;
  description: string;
}
