import { Conversation } from "./types";

// Sample conversation data
export const sampleConversations: Conversation[] = [
  {
    id: "1",
    title: "Conversation 01",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "10:30 AM",
    messages: [
      {
        id: "msg1",
        text: "Hello! How can I help you today?",
        sender: "ai",
        timestamp: "10:25 AM",
      },
      {
        id: "msg2",
        text: "I need help with my account.",
        sender: "user",
        timestamp: "10:26 AM",
      },
    ],
  },
  {
    id: "2",
    title: "Conversation 02",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "10:40 AM",
    messages: [
      {
        id: "msg1",
        text: "It seems there was a technical issue generating your performance report. Please specify if you want a portfolio-level report, asset-level details, or a particular institution or time frame. This will help me provide a more accurate performance report for you. Could you clarify your request?",
        sender: "ai",
        timestamp: "10:40 AM",
      },
      {
        id: "msg2",
        text: "Hey Sophie! How are you?",
        sender: "user",
        timestamp: "10:41 AM",
      },
    ],
  },
  {
    id: "3",
    title: "Conversation 03",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "9:15 AM",
    messages: [
      {
        id: "msg1",
        text: "Good morning! What can I assist you with?",
        sender: "ai",
        timestamp: "9:15 AM",
      },
    ],
  },
  {
    id: "4",
    title: "Conversation 04",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "msg1",
        text: "Thank you for contacting us.",
        sender: "ai",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "5",
    title: "Conversation 05",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "msg1",
        text: "How can I help you today?",
        sender: "ai",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "6",
    title: "Conversation 06",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "2 days ago",
    messages: [
      {
        id: "msg1",
        text: "Hello there!",
        sender: "ai",
        timestamp: "2 days ago",
      },
    ],
  },
  {
    id: "7",
    title: "Conversation 07",
    preview: "Lorem ipsum dolor sit amet consectetur.",
    lastMessageTime: "3 days ago",
    messages: [
      {
        id: "msg1",
        text: "Welcome! How can I assist?",
        sender: "ai",
        timestamp: "3 days ago",
      },
    ],
  },
];




