import { create } from "zustand";
import { Conversation, Message } from "@/types/dashboard";
import { dummyConversations, dummyMessages } from "@/data/dummyData";

interface ConversationsState {
  conversations: Conversation[];
  currentConversationId: number | null;
  allMessages: Message[]; // Store all messages globally
  messages: Message[]; // Filtered messages for current conversation

  // Actions
  addConversation: (conversation: Conversation) => void;
  deleteConversation: (id: number) => void;
  setCurrentConversation: (id: number | null) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: dummyConversations,
  currentConversationId: -1, // -1 indicates new conversation
  allMessages: dummyMessages,
  messages: [],

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  deleteConversation: (id) =>
    set((state) => {
      // Remove conversation and all its messages
      const filteredMessages = state.allMessages.filter(
        (msg) => msg.conversationId !== id
      );

      return {
        conversations: state.conversations.filter((conv) => conv.id !== id),
        allMessages: filteredMessages,
        currentConversationId:
          state.currentConversationId === id ? null : state.currentConversationId,
        messages: state.currentConversationId === id ? [] : state.messages,
      };
    }),

  setCurrentConversation: (id) =>
    set((state) => {
      // Filter messages by conversationId
      const filteredMessages = state.allMessages.filter(
        (msg) => msg.conversationId === id
      );

      return {
        currentConversationId: id,
        messages: filteredMessages,
      };
    }),

  addMessage: (message) =>
    set((state) => {
      // Add message to allMessages
      const newAllMessages = [...state.allMessages, message];

      // Update filtered messages only if the message belongs to current conversation
      const newMessages =
        message.conversationId === state.currentConversationId
          ? [...state.messages, message]
          : state.messages;

      return {
        allMessages: newAllMessages,
        messages: newMessages,
      };
    }),

  clearMessages: () =>
    set({
      messages: [],
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),
}));
