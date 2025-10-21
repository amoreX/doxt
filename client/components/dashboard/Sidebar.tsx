import { Plus, Chat } from "@phosphor-icons/react";
import { SidebarProps } from "@/types/dashboard";

interface ExtendedSidebarProps extends SidebarProps {
  currentConversationId: number | null;
  onConversationClick: (id: number) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  isOpen,
  conversations,
  currentConversationId,
  onConversationClick,
  onNewChat,
}: ExtendedSidebarProps) {
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-0"
      } transition-all duration-300  backdrop-blur-md  flex flex-col overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/20">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg shadow-slate-800/20"
        >
          <Plus className="w-5 h-5" weight="bold" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Recent
        </h3>
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onConversationClick(conv.id)}
            className={`w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors duration-200 group ${
              currentConversationId === conv.id ? "bg-slate-800" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate group-hover:text-white transition-colors ${
                    currentConversationId === conv.id
                      ? "text-white"
                      : "text-slate-700"
                  }`}
                >
                  {conv.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{conv.date}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
