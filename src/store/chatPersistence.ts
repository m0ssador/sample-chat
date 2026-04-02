import type { Middleware } from '@reduxjs/toolkit';
import type { Chat, ChatState, Message } from './chatTypes';

const STORAGE_KEY = 'ts-react-vite-chat-state-v1';

/** То, что пишем в localStorage (без временных полей) */
interface PersistedChatPayload {
  chats: Chat[];
  activeChatId: number | null;
  searchQuery: string;
}

function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === 'number' &&
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' &&
    typeof m.timestamp === 'string'
  );
}

function isChat(value: unknown): value is Chat {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as Record<string, unknown>;
  if (
    typeof c.id !== 'number' ||
    typeof c.name !== 'string' ||
    typeof c.lastMessageDate !== 'string'
  ) {
    return false;
  }
  if (!Array.isArray(c.messages)) return false;
  return c.messages.every(isMessage);
}

function normalizeActiveChatId(
  chats: Chat[],
  activeChatId: number | null,
): number | null {
  if (activeChatId == null) return chats[0]?.id ?? null;
  return chats.some((c) => c.id === activeChatId)
    ? activeChatId
    : chats[0]?.id ?? null;
}

/**
 * Читает и разбирает сохранённое состояние. При битом JSON, неверной форме
 * или отсутствии ключа возвращает null.
 */
export function loadPersistedChatState(): ChatState | null {
  if (typeof localStorage === 'undefined') return null;

  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (raw == null || raw === '') return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;
  const o = parsed as Record<string, unknown>;

  if (!Array.isArray(o.chats) || !o.chats.every(isChat)) return null;

  if (typeof o.activeChatId !== 'number' && o.activeChatId !== null) {
    return null;
  }

  const searchQuery = typeof o.searchQuery === 'string' ? o.searchQuery : '';

  const chats = o.chats as Chat[];
  const activeChatId = normalizeActiveChatId(chats, o.activeChatId);

  return {
    chats,
    activeChatId,
    searchQuery,
    isLoading: false,
    error: null,
  };
}

export function persistChatState(state: ChatState): void {
  if (typeof localStorage === 'undefined') return;

  const payload: PersistedChatPayload = {
    chats: state.chats,
    activeChatId: state.activeChatId,
    searchQuery: state.searchQuery,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* квота, приватный режим и т.п. */
  }
}

export const chatPersistenceMiddleware: Middleware<
  object,
  { chat: ChatState }
> = (store) => (next) => (action) => {
  const result = next(action);

  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof (action as { type: unknown }).type === 'string' &&
    (action as { type: string }).type.startsWith('chat/')
  ) {
    try {
      persistChatState(store.getState().chat);
    } catch {
      /* на случай нестандартного getState */
    }
  }

  return result;
};
