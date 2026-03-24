export interface MessageData {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

/** Сообщение в окне чата (role / content — как в задании) */
export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Chat {
    id: number;
    name: string;
    lastMessageDate: string;
    messages: MessageData[]
}

export interface Settings {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: 'light' | 'dark';
}