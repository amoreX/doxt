"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ChatArea from "@/components/dashboard/ChatArea";
import ChatInput from "@/components/dashboard/ChatInput";
import { Message } from "@/types/dashboard";

const dummyConversations = [
  { id: 1, title: "Website scraping help", date: "Today" },
  { id: 2, title: "Document analysis", date: "Yesterday" },
  { id: 3, title: "Data extraction tips", date: "2 days ago" },
];

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: "user", content: message }]);

    // Dummy response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is a dummy response. Functionality coming soon!",
        },
      ]);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} conversations={dummyConversations} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
          <div className="h-full px-6 py-8">
            <ChatArea messages={messages} />
          </div>
        </main>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
