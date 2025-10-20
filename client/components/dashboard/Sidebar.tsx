import { Plus, Chat } from "@phosphor-icons/react";
import { SidebarProps } from "@/types/dashboard";

export default function Sidebar({ isOpen, conversations }: SidebarProps) {
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-0"
      } transition-all duration-300  backdrop-blur-md  flex flex-col overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/20">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg shadow-slate-800/20">
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
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/50 transition-colors duration-200 group"
          >
            <div className="flex items-start gap-3">
              <Chat
                className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0"
                weight="regular"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 font-medium truncate group-hover:text-slate-800 transition-colors">
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
