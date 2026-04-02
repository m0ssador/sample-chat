import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chat, ChatState, Message } from './chatTypes';
import { mockChats } from '../mocks/data';

function hydrateChatsFromMocks(): Chat[] {
  return mockChats.map((c) => ({
    id: c.id,
    name: c.name,
    lastMessageDate: c.lastMessageDate,
    messages: c.messages.map(
      (m): Message => ({
        id: m.id,
        role: m.sender,
        content: m.text,
        timestamp: m.timestamp,
      }),
    ),
  }));
}

const initialState: ChatState = {
  chats: hydrateChatsFromMocks(),
  activeChatId: mockChats[0]?.id ?? null,
  isLoading: false,
  error: null,
  searchQuery: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChatId(state, action: PayloadAction<number | null>) {
      state.activeChatId = action.payload;
      state.error = null;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    stopLoading(state) {
      state.isLoading = false;
    },

    appendUserMessage(
      state,
      action: PayloadAction<{
        chatId: number;
        message: Message;
        lastMessageDate?: string;
      }>,
    ) {
      const { chatId, message, lastMessageDate } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (!chat) return;
      chat.messages.push(message);
      if (lastMessageDate !== undefined) {
        chat.lastMessageDate = lastMessageDate;
      }
    },

    appendAssistantMessage(
      state,
      action: PayloadAction<{
        chatId: number;
        message: Message;
        lastMessageDate?: string;
      }>,
    ) {
      const { chatId, message, lastMessageDate } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (!chat) return;
      chat.messages.push(message);
      if (lastMessageDate !== undefined) {
        chat.lastMessageDate = lastMessageDate;
      }
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    addChat(state) {
      const nextId =
        state.chats.length === 0
          ? 1
          : Math.max(...state.chats.map((c) => c.id)) + 1;
      const newChat: Chat = {
        id: nextId,
        name: `Новый чат ${nextId}`,
        lastMessageDate: '—',
        messages: [],
      };
      state.chats.unshift(newChat);
      state.activeChatId = nextId;
      state.error = null;
    },

    deleteChat(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.chats = state.chats.filter((c) => c.id !== id);
      if (state.activeChatId === id) {
        state.activeChatId = state.chats[0]?.id ?? null;
      }
    },

    renameChat(state, action: PayloadAction<{ id: number; name: string }>) {
      const { id, name } = action.payload;
      const chat = state.chats.find((c) => c.id === id);
      if (!chat) return;
      const trimmed = name.trim();
      if (trimmed.length > 0) {
        chat.name = trimmed;
      }
    },
  },
});

export const {
  setActiveChatId,
  setError,
  clearError,
  setLoading,
  stopLoading,
  appendUserMessage,
  appendAssistantMessage,
  setSearchQuery,
  addChat,
  deleteChat,
  renameChat,
} = chatSlice.actions;

export default chatSlice.reducer;
