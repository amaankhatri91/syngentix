
// Sample data type
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

export interface FormValues {
  agentName: string;
  description: string;
}