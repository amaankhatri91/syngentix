import React, { useState, useRef, useEffect } from "react";
import useTheme from "@/utils/hooks/useTheme";
import { Button } from "@/components/Button";
import { Add } from "@/assets/app-icons";
import { dummyMessages } from "./dymmyData";
import { Message } from "./type";

const WorkflowEditorChat = () => {
  const { isDark } = useTheme();
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
      // if (textareaRef.current) {

      //   textareaRef.current.style.height = "auto";
      // }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by timestamp
  const groupedMessages = dummyMessages.reduce((acc, message, index) => {
    const prevMessage = index > 0 ? dummyMessages[index - 1] : null;
    if (
      prevMessage &&
      prevMessage.sender === message.sender &&
      prevMessage.timestamp === message.timestamp
    ) {
      acc[acc.length - 1].messages.push(message);
    } else {
      acc.push({
        timestamp: message.timestamp,
        sender: message.sender,
        messages: [message],
      });
    }
    return acc;
  }, [] as Array<{ timestamp: string; sender: "user" | "ai"; messages: Message[] }>);

  return (
    <div
      className={`h-full flex flex-col border rounded-3xl ${
        isDark ? "bg-[#0F1724] border-[#2B3643]" : "bg-white border-[#E3E6EB]"
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-4 py-2.5 border-b rounded-t-3xl ${
          isDark ? "bg-[#0F1724] border-[#1E2A3A]" : "bg-white border-[#EEF4FF]"
        }`}
      >
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          Chat With Agent
        </h3>
        <Button
          onClick={() => {
            console.log("New chat clicked");
          }}
          icon={<Add color="white" size={16} />}
          className="px-2.5 rounded-2xl !py-2 !text-white !bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
        >
          New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDark ? "bg-[#0F1724]" : "bg-[#F5F7FA]"
        }`}
      >
        {groupedMessages.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`flex flex-col ${
              group.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex flex-col gap-2 max-w-[70%]">
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={`px-4 py-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white"
                      : isDark
                      ? "bg-[#1C2643] text-white"
                      : "bg-white text-[#162230]"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <span
              className={`text-xs mt-1 ${
                isDark ? "text-[#BDC9F5]" : "text-[#848A94]"
              }`}
            >
              {group.timestamp}
            </span>
          </div>
        ))}
      </div>
      <div
        className={`pb-3 px-4 rounded-b-3xl border-t ${
          isDark
            ? "bg-[#0F1724] border-[#2B3643]"
            : "bg-[#F5F7FA] border-[#EEF4FF]"
        }`}
      >
        <div className="relative flex items-end">
          <textarea
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            className={`
              w-full min-h-[48px] max-h-[200px] px-4 pr-32 py-3 rounded-lg resize-none overflow-y-auto
              ${
                isDark
                  ? "bg-[#1C2643] text-white placeholder-gray-400"
                  : "bg-white text-[#162230] placeholder-gray-500"
              }
              border-none outline-none focus:outline-none
            `}
            style={{
              height: "auto",
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="absolute right-2 bottom-2 px-4 py-2 rounded-lg font-medium text-sm !bg-gradient-to-r from-[#9133EA] to-[#2962EB] !text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Send now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditorChat;
