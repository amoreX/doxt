export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: number;
  title: string;
  date: string;
}

export interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
}

export interface HeaderProps {
  onToggleSidebar: () => void;
}

export interface ChatAreaProps {
  messages: Message[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export interface UrlInputProps {
  attachedUrls: string[];
  onAddUrl: (url: string) => void;
  onRemoveUrl: (url: string) => void;
  showInput: boolean;
  onToggleInput: () => void;
}
