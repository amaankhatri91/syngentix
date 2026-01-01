import { EdgeTypes, NodeTypes } from "reactflow";
import WorkflowEdge from "./WorkflowEdge";
import CanvasNode from "./WorkflowCanvasNode";
import WorkflowNoteNode from "./WorkflowNoteNode";

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



// Define edge types
export const edgeTypes: EdgeTypes = {
  smoothstep: WorkflowEdge,
  bezier: WorkflowEdge,
  default: WorkflowEdge,
};


// Define node types
export const nodeTypes: NodeTypes = {
  custom: CanvasNode,
  note: WorkflowNoteNode,
};

// API Node Types
export interface NodePin {
  id: string;
  name: string;
  type: string;
  required: boolean;
  custom: boolean;
}

export interface ConfigSchemaMetadata {
  allow_custom_input_pins: boolean;
  allow_custom_output_pins: boolean;
  allow_custom_next_pins: boolean;
  allow_trigger_pins: boolean;
}

export interface ConfigSchemaProperty {
  type?: string;
  description?: string;
  default?: any;
  enum?: string[];
  title?: string;
  minimum?: number;
  maximum?: number;
  items?: {
    type: string;
    properties?: Record<string, ConfigSchemaProperty>;
    required?: string[];
  };
  properties?: Record<string, ConfigSchemaProperty>;
  required?: string[];
}

export interface ConfigSchema {
  type: string;
  properties?: Record<string, ConfigSchemaProperty>;
  required?: string[];
  metadata?: ConfigSchemaMetadata;
}

export interface Node {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  inputs: NodePin[];
  outputs: NodePin[];
  trigger_pins: NodePin[];
  next_pins: NodePin[];
  config_schema: ConfigSchema;
}

export interface NodesApiResponse {
  status: "success" | "failed";
  message: string;
  data: Node[];
}

export type NodesResponse = NodesApiResponse;

