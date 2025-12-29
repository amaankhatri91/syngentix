import { EdgeTypes } from "reactflow";
import WorkflowEdge from "./WorkflowEdge";

// Define edge types
export const edgeTypes: EdgeTypes = {
  smoothstep: WorkflowEdge,
  bezier: WorkflowEdge,
  default: WorkflowEdge,
};

