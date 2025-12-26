import React, { useState, useRef, useEffect } from "react";
import useTheme from "@/utils/hooks/useTheme";
import { sampleConversations } from "./ConversationsData";
import { Conversation, Message } from "./types";

interface MessageContentProps {
  conversationId?: string;
}

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="10" cy="4" r="1.5" fill="currentColor" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="10" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33333 10H2.66667C2.31305 10 1.97391 9.85952 1.72386 9.60947C1.47381 9.35942 1.33333 9.02028 1.33333 8.66667V2.66667C1.33333 2.31305 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31305 1.33333 2.66667 1.33333H8.66667C9.02028 1.33333 9.35942 1.47381 9.60947 1.72386C9.85952 1.97391 10 2.31305 10 2.66667V3.33333"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpeakerIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 5.33333V10.6667C3 10.8435 3.07024 11.0131 3.19526 11.1381C3.32029 11.2631 3.48986 11.3333 3.66667 11.3333H5.33333L8.66667 14.6667C8.84348 14.8435 9.06803 14.9378 9.3 14.9333H9.36667C9.59864 14.9378 9.82319 14.8435 10 14.6667L13.3333 11.3333H13.6667C13.8435 11.3333 14.0131 11.2631 14.1381 11.1381C14.2631 11.0131 14.3333 10.8435 14.3333 10.6667V5.33333C14.3333 5.15652 14.2631 4.98695 14.1381 4.86193C14.0131 4.7369 13.8435 4.66667 13.6667 4.66667H13.3333L10 1.33333C9.82319 1.15652 9.59864 1.06219 9.36667 1.06667H9.3C9.06803 1.06219 8.84348 1.15652 8.66667 1.33333L5.33333 4.66667H3.66667C3.48986 4.66667 3.32029 4.7369 3.19526 4.86193C3.07024 4.98695 3 5.15652 3 5.33333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 6L10 8L6 10V6Z" fill="currentColor" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 9.33333C13.1046 9.33333 14 8.4379 14 7.33333C14 6.22876 13.1046 5.33333 12 5.33333C10.8954 5.33333 10 6.22876 10 7.33333C10 8.4379 10.8954 9.33333 12 9.33333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 10.6667C5.10457 10.6667 6 9.77124 6 8.66667C6 7.5621 5.10457 6.66667 4 6.66667C2.89543 6.66667 2 7.5621 2 8.66667C2 9.77124 2.89543 10.6667 4 10.6667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.6 8L10.4 6.66667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14.6667 1.33333L7.33333 8.66667M14.6667 1.33333L10 14.6667L7.33333 8.66667M14.6667 1.33333L1.33333 5.33333L7.33333 8.66667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AIIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M8 10C8 10.5523 8.44772 11 9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10Z"
      fill="white"
    />
    <path
      d="M14 10C14 10.5523 14.4477 11 15 11C15.5523 11 16 10.5523 16 10C16 9.44772 15.5523 9 15 9C14.4477 9 14 9.44772 14 10Z"
      fill="white"
    />
    <path
      d="M9 15C9 15 10 17 12 17C14 17 15 15 15 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MessageContent: React.FC<MessageContentProps> = ({ conversationId }) => {
  const { isDark } = useTheme();
  const [messageInput, setMessageInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conversation =
    sampleConversations.find((conv) => conv.id === conversationId) ||
    sampleConversations[1]; // Default to Conversation 02

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle send message (static for now)
      console.log("Sending message:", messageInput);
      setMessageInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`h-full flex flex-col rounded-2xl ${
        isDark ? "border border-[#2B3643]" : " border border-[#E3E6EB]"
      }`}
    >
      {/* Header */}
      <div
        className={` border-b rounded-t-2xl ${
          isDark ? "border-[#1E2A3A] bg-[#0C1116]" : "border-[#EEF4FF] bg-white"
        } flex justify-between items-center px-4 py-3`}
      >
        <h2 className="text-lg font-semibold">{conversation.title}</h2>
        <button>
          <MenuIcon className={isDark ? "text-gray-400" : "text-gray-600"} />
        </button>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-6 ${
          isDark ? "bg-[#0F1724]" : "bg-[#F5F7FA]"
        }`}
      >
        {conversation.messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <div className="mr-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9133ea] to-[#2962eb] flex items-center justify-center">
                  <AIIcon className="text-white" />
                </div>
              </div>
            )}
            <div
              className={`flex flex-col max-w-[70%] ${
                message.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-white"
                    : isDark
                    ? "bg-[#1C2643] text-white"
                    : "bg-[#F5F7FA] text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.sender === "ai" && (
                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-1.5 rounded hover:bg-opacity-10 ${
                        isDark
                          ? "text-gray-400 hover:bg-white"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1.5 rounded hover:bg-opacity-10 ${
                        isDark
                          ? "text-gray-400 hover:bg-white"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <SpeakerIcon className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1.5 rounded hover:bg-opacity-10 ${
                        isDark
                          ? "text-gray-400 hover:bg-white"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Input Area */}
      <div
        className={`py-3 px-4 rounded-b-2xl ${
          isDark ? "bg-[#0F1724]" : "bg-[#F5F7FA]"
        }`}
      >
        <div className="relative flex items-end">
          <textarea
            ref={textareaRef}
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            className={`
              w-full min-h-[48px] max-h-[200px] px-4 pr-36 py-3 rounded-lg resize-none overflow-y-auto
              ${
                isDark
                  ? "bg-[#1C2643] text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
              }
              border-none outline-none focus:outline-none
            `}
            style={{
              height: "auto",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className={`
              absolute right-2 bottom-2 px-5 py-2 rounded-lg font-medium text-sm
              bg-gradient-to-r from-[#9133EA] to-[#2962EB]
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:opacity-90 transition-opacity
              flex items-center gap-2
            `}
          >
            <SendIcon className="w-4 h-4" />
            Send now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageContent;
