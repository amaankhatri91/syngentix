import React, { useState } from "react";
import { Button } from "@/components/Button";
import Add from "@/assets/app-icons/Add";
import useTheme from "@/utils/hooks/useTheme";
import { sampleConversations } from "./ConversationsData";
import { Conversation } from "./types";
import { SearchInput } from "@/components/SearchInput";

interface ConversationsListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  selectedConversationId,
  onConversationSelect,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = sampleConversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`h-full flex flex-col border rounded-2xl p-4 ${
        isDark
          ? "bg-[#0F1724]  border-[#2B3643]"
          : "bg-[#F5F7FA]  border-[#E3E6EB]"
      }`}
    >
      {/* Header */}
      <div className="">
        {/* Conversations Header with New Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base text-[18px] font-medium">Conversations</h3>
          <Button
            onClick={() => {
              // Handle new conversation
              console.log("New conversation clicked");
            }}
            icon={<Add />}
            className="px-2.5 rounded-2xl !py-1.5 !text-white !bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
          >
            New
          </Button>
        </div>
        <SearchInput
          placeholder="Search Conversation"
          onSearch={(value) => {
            setSearchQuery(value);
          }}
          width="w-full"
          className="text-sm text-[#0C1116] w-full text-[14px] mb-4"
          debounceDelay={300}
        />
      </div>
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto ">
        {filteredConversations?.map((conversation: Conversation) => (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
            className={`
              px-3 py-2 mb-3 rounded-lg cursor-pointer transition-all
              ${
                selectedConversationId === conversation.id
                  ? isDark
                    ? "border border-[#9133ea]"
                    : "border bg-white border-[#9133ea] shadow-[1px_4px_6px_0px_#2154EE1A]"
                  : isDark
                  ? "bg-[#0C1116]  border border-[#2B3643]"
                  : "bg-[#FFFFFF] border border-[#EEF4FF] shadow-[1px_4px_6px_0px_#2154EE1A]"
              }
            `}
          >
            <h4 className={`font-medium mb-1`}>{conversation.title}</h4>
            <p className={`text-sm`}>{conversation.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsList;
