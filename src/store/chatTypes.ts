import type { PayloadAction } from '@reduxjs/toolkit';

/** Сообщение в чате (глобальный стор) */
export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/** Чат со списком сообщений */
export interface Chat {
  id: number;
  name: string;
  lastMessageDate: string;
  messages: Message[];
}

/** Состояние домена чатов в Redux */
export interface ChatState {
  chats: Chat[];
  activeChatId: number | null;
  isLoading: boolean;
  error: string | null;
  /** Строка поиска по названию и последнему сообщению */
  searchQuery: string;
}

/**
 * Типы действий над чатами (для задания и согласованности с RTK slice `chat`).
 * Соответствуют `PayloadAction` из `createSlice`.
 */
export type ChatAction =
  | PayloadAction<number | null, 'chat/setActiveChatId'>
  | PayloadAction<string | null, 'chat/setError'>
  | PayloadAction<void, 'chat/clearError'>
  | PayloadAction<boolean, 'chat/setLoading'>
  | PayloadAction<
      { chatId: number; message: Message; lastMessageDate?: string },
      'chat/appendUserMessage'
    >
  | PayloadAction<
      { chatId: number; message: Message; lastMessageDate?: string },
      'chat/appendAssistantMessage'
    >
  | PayloadAction<void, 'chat/stopLoading'>
  | PayloadAction<string, 'chat/setSearchQuery'>
  | PayloadAction<void, 'chat/addChat'>
  | PayloadAction<number, 'chat/deleteChat'>
  | PayloadAction<{ id: number; name: string }, 'chat/renameChat'>
  | PayloadAction<
      { chatId: number; messageId: number; content: string },
      'chat/updateAssistantMessageContent'
    >;
