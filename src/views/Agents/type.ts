
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