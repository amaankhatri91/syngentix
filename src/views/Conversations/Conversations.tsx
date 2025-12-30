import React, { useState } from "react";
import ConversationsList from "./ConversationsList";
import MessageContent from "./MessageContent";

const Conversations = () => {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("2");

  return (
    <div className=" overflow-hidden grid grid-cols-12 gap-4">
      {/* Left Sidebar - Conversations List */}
      <div className="col-span-12 md:col-span-4 lg:col-span-3">
        <ConversationsList
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
        />
      </div>
      {/* Right Panel - Message Content */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9">
        <MessageContent conversationId={selectedConversationId} />
      </div>
    </div>
  );
};

export default Conversations;


