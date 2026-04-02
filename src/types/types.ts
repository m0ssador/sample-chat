export interface MessageData {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

/** Алиас для UI: то же, что `Message` в глобальном сторе */
export type { Message as ChatMessage, Message, Chat, ChatState, ChatAction } from '../store/chatTypes';

export interface Settings {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: 'light' | 'dark';
}
