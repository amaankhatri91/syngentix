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

// Custom Controls types
export interface CustomControlsProps {
  isLocked: boolean;
  onToggleLock: () => void;
}

// Workflow Node types
export interface WorkflowNodeProps {
  data: any; // CustomNodeData from dummy.ts
  selected?: boolean;
}

// Workflow Edge types
export interface WorkflowEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: React.CSSProperties;
  markerEnd?: any;
}