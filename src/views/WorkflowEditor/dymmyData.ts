import { Message, WorkflowNode } from "./type";

import { Node, Edge } from "reactflow";

// Node types based on the images
export interface CustomNodeData {
  label: string;
  nodeType: "entry" | "text" | "parameter" | "switch" | "api" | "note";
  dotColor: string;
  borderColor: string;
  inputs?: string[];
  outputs?: string[];
  switchOptions?: string[];
}

export const dummyNodes: WorkflowNode[] = [
  {
    id: "1",
    title: "To JSON Node",
    description: "Convert text to JSON object",
    actions: [
      { label: "Input", type: "input" },
      { label: "Output", type: "output" },
    ],
    statusColor: "#A970FF", // Purple
  },
  {
    id: "2",
    title: "Text Node",
    description: "Manage Text",
    actions: [
      { label: "Input", type: "input" },
      { label: "Output", type: "output" },
    ],
    statusColor: "#22D3EE", // Cyan
  },
  {
    id: "3",
    title: "Key/Value (Get) Node",
    description: "Get a value for a given key",
    actions: [{ label: "Data", type: "data" }],
    statusColor: "#A3E635", // Light green
  },
  {
    id: "4",
    title: "Entry Node",
    description: "Entry Node",
    actions: [{ label: "Trigger", type: "trigger" }],
    statusColor: "#CE93D8", // Pink/Magenta
  },
  {
    id: "5",
    title: "Parameter Node",
    description:
      "Parameter Node. Can be a primitive, or an object if provided a",
    actions: [
      { label: "Input", type: "input" },
      { label: "Output", type: "output" },
    ],
    statusColor: "#FFA500", // Orange
  },
  {
    id: "6",
    title: "Fetch Data From Table Node",

    description:
      "Fetch data from a database table using given connection and filters",
    actions: [{ label: "Visualization", type: "Visualization" }],
    statusColor: "#87CEEB", // Light blue
  },
];

// Dummy messages data
export const dummyMessages: Message[] = [
  {
    id: "1",
    text: "Hello John! Hope you're doing well. I need your help with some reports, are you available for a call later today?",
    sender: "ai",
    timestamp: "10:40 AM",
  },
  {
    id: "2",
    text: "Thank you",
    sender: "ai",
    timestamp: "10:40 AM",
  },
  {
    id: "3",
    text: "Hey Sophie! How are you?",
    sender: "user",
    timestamp: "11:41 AM",
  },
  {
    id: "4",
    text: "For sure, I'll be free after mid-day, let me know what time works for you",
    sender: "user",
    timestamp: "11:41 AM",
  },
];

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
        "Default ",
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
  {
    id: "note-node-1",
    type: "note",
    position: { x: 0, y: 300 },
    data: {
      label: "Note Node",
      nodeType: "note",
      dotColor: "#B3EFBD", // Light green
      borderColor: "from-purple-500 to-blue-500",
      // No inputs or outputs - no connections
    },
  },
  {
    id: "note-node-2",
    type: "note",
    position: { x: 250, y: 300 },
    data: {
      label: "Note Node",
      nodeType: "note",
      dotColor: "#B3EFBD", // Light green
      borderColor: "from-purple-500 to-blue-500",
      // No inputs or outputs - no connections
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
