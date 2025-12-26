export interface NodeAction {
  label: string;
  type: "input" | "output" | "trigger" | "data" | "Visualization";
}

export interface WorkflowNode {
  id: string;
  title: string;
  description: string;
  actions: NodeAction[];
  statusColor: string;
}

// Conversation data types
export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
  lastMessageTime?: string;
}
