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

