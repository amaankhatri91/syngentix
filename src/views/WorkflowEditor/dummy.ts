import { Node, Edge } from "reactflow";

// Node types based on the images
export interface CustomNodeData {
  label: string;
  nodeType: "entry" | "text" | "parameter" | "switch" | "api";
  dotColor: string;
  borderColor: string;
  inputs?: string[];
  outputs?: string[];
  switchOptions?: string[];
}

// Static nodes data based on the images
export const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "entry-node",
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      label: "Entry Node",
      nodeType: "entry",
      dotColor: "#EC4899", // Pink
      borderColor: "from-purple-500 to-blue-500",
      outputs: ["Next"],
    },
  },
  {
    id: "text-node",
    type: "custom",
    position: { x: 250, y: 0 },
    data: {
      label: "Text Node",
      nodeType: "text",
      dotColor: "#22D3EE", // Light blue
      borderColor: "from-blue-500 to-purple-500",
      inputs: ["Start"],
      outputs: ["Next", "Text"],
    },
  },
  {
    id: "parameter-node",
    type: "custom",
    position: { x: 250, y: 150 },
    data: {
      label: "Parameter Node",
      nodeType: "parameter",
      dotColor: "#FFA500", // Orange
      borderColor: "from-purple-500 to-blue-500",
      outputs: ["Data"],
    },
  },
  {
    id: "switch-node",
    type: "custom",
    position: { x: 500, y: 0 },
    data: {
      label: "Switch",
      nodeType: "switch",
      dotColor: "#EF4444", // Red
      borderColor: "from-blue-500 to-purple-500",
      inputs: ["Start", "Input"],
      outputs: [
        "Default",
        "Pizza",
        "Pizza Menu",
        "Pizza & Beverages",
        "Pizza & Drinks",
        "Both",
        "Beverages",
        "Drinks",
        "Beverages & Menu",
      ],
      switchOptions: [
        "Default",
        "Pizza",
        "Pizza Menu",
        "Pizza & Beverages",
        "Pizza & Drinks",
        "Both",
        "Beverages",
        "Drinks",
        "Beverages & Menu",
      ],
    },
  },
  {
    id: "api-node",
    type: "custom",
    position: { x: 500, y: 300 },
    data: {
      label: "API Node",
      nodeType: "api",
      dotColor: "#3B82F6", // Blue
      borderColor: "from-purple-500 to-blue-500",
      inputs: ["Start"], // Will create multiple handles for multiple connections
      outputs: ["Next", "Response"],
    },
  },
];

// Static edges (connections) based on the images
export const initialEdges: Edge[] = [
  // Entry Node -> Text Node
  {
    id: "e1-entry-text",
    source: "entry-node",
    target: "text-node",
    sourceHandle: "Next",
    targetHandle: "Start",
    type: "bezier",
    style: { stroke: "#94A3B8", strokeWidth: 2 },
  },
  // Text Node -> Switch Node (dashed line)
  {
    id: "e2-text-switch",
    source: "text-node",
    target: "switch-node",
    sourceHandle: "Next",
    targetHandle: "Input",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2, strokeDasharray: "5,5" },
  },
  // Parameter Node -> Switch Node (solid line)
  {
    id: "e3-parameter-switch",
    source: "parameter-node",
    target: "switch-node",
    sourceHandle: "Data",
    targetHandle: "Start",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  // Switch Node outputs -> API Node (multiple connections with spaced handles)
  {
    id: "e4-switch-api-default",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Default",
    targetHandle: "Start-0",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e5-switch-api-pizza",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Pizza",
    targetHandle: "Start-1",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e6-switch-api-pizza-menu",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Pizza Menu",
    targetHandle: "Start-2",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e7-switch-api-pizza-beverages",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Pizza & Beverages",
    targetHandle: "Start-3",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e8-switch-api-pizza-drinks",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Pizza & Drinks",
    targetHandle: "Start-4",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e9-switch-api-both",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Both",
    targetHandle: "Start-5",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e10-switch-api-beverages",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Beverages",
    targetHandle: "Start-6",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
  {
    id: "e11-switch-api-drinks",
    source: "switch-node",
    target: "api-node",
    sourceHandle: "Drinks",
    targetHandle: "Start-7",
    type: "bezier",
    style: { stroke: "#22D3EE", strokeWidth: 2 },
  },
];

