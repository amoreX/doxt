"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ChatArea from "@/components/dashboard/ChatArea";
import ChatInput from "@/components/dashboard/ChatInput";
import BackgroundParticles from "@/components/dashboard/BackgroundParticles";
import { useConversationsStore } from "@/store/conversationsStore";
import { createConversation, createTitleFromMessage } from "@/utils/conversationUtils";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    conversations,
    messages,
    currentConversationId,
    setCurrentConversation,
    addMessage,
    addConversation,
  } = useConversationsStore();

  const handleSendMessage = (message: string) => {
    let conversationId = currentConversationId;

    // If it's a new conversation (id = -1), create a new conversation
    if (currentConversationId === -1) {
      const title = createTitleFromMessage(message);
      const newConversation = createConversation(conversations, title);

      addConversation(newConversation);
      setCurrentConversation(newConversation.id);
      conversationId = newConversation.id;
    }

    addMessage({
      role: "user",
      content: message,
      conversationId: conversationId!,
    });

    // Dummy response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "This is a dummy response. Functionality coming soon!",
        conversationId: conversationId!,
      });
    }, 500);
  };

  const handleConversationClick = (id: number) => {
    setCurrentConversation(id);
  };

  const handleNewChat = () => {
    setCurrentConversation(-1);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative">
      {/* Background Particles */}
      <BackgroundParticles />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationClick={handleConversationClick}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full px-6 py-8">
            <ChatArea messages={messages} />
          </div>
        </main>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={false}
        />
      </div>
    </div>
  );
}
