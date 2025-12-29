import { Message, WorkflowNode } from "./type";

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
