import type { RootState } from './store';
import type { Chat, Message } from './chatTypes';

export function selectChats(state: RootState): Chat[] {
  return state.chat.chats;
}

export function selectSearchQuery(state: RootState): string {
  return state.chat.searchQuery;
}

/** Чаты с учётом поиска по названию и тексту последнего сообщения */
export function selectFilteredChats(state: RootState): Chat[] {
  const q = state.chat.searchQuery.trim().toLowerCase();
  const chats = state.chat.chats;
  if (!q) return chats;
  return chats.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    const last = c.messages[c.messages.length - 1];
    if (last && last.content.toLowerCase().includes(q)) return true;
    return false;
  });
}

export function selectActiveChatId(state: RootState): number | null {
  return state.chat.activeChatId;
}

export function selectActiveChat(state: RootState): Chat | null {
  const { chats, activeChatId } = state.chat;
  if (activeChatId == null) return null;
  return chats.find((c) => c.id === activeChatId) ?? null;
}

/** Сообщения текущего активного чата */
export function selectActiveChatMessages(state: RootState): Message[] {
  return selectActiveChat(state)?.messages ?? [];
}

export function selectChatLoading(state: RootState): boolean {
  return state.chat.isLoading;
}

export function selectChatError(state: RootState): string | null {
  return state.chat.error;
}

/** Следующий свободный id сообщения по всем чатам */
export function selectNextMessageId(state: RootState): number {
  let max = 0;
  for (const c of state.chat.chats) {
    for (const m of c.messages) {
      max = Math.max(max, m.id);
    }
  }
  return max + 1;
}
