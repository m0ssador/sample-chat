import { describe, it, expect } from 'vitest';
import chatReducer, {
  addChat,
  appendUserMessage,
  deleteChat,
  renameChat,
} from './chatSlice';
import type { ChatState, Message } from './chatTypes';

function emptyState(overrides: Partial<ChatState> = {}): ChatState {
  return {
    chats: [],
    activeChatId: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    ...overrides,
  };
}

describe('chatSlice reducer', () => {
  it('appendUserMessage (ADD_MESSAGE): увеличивает messages на 1, новое сообщение в конце', () => {
    const msg: Message = {
      id: 100,
      role: 'user',
      content: 'Привет',
      timestamp: '10:00',
    };
    const prev = emptyState({
      chats: [
        {
          id: 1,
          name: 'Чат',
          lastMessageDate: '—',
          messages: [
            {
              id: 1,
              role: 'user',
              content: 'старое',
              timestamp: '09:00',
            },
          ],
        },
      ],
      activeChatId: 1,
    });

    const next = chatReducer(
      prev,
      appendUserMessage({ chatId: 1, message: msg }),
    );

    expect(next.chats[0].messages).toHaveLength(2);
    expect(next.chats[0].messages.at(-1)).toEqual(msg);
  });

  it('addChat (CREATE_CHAT): новый чат с уникальным id и появление в chats', () => {
    const prev = emptyState({
      chats: [
        {
          id: 2,
          name: 'Старый',
          lastMessageDate: '—',
          messages: [],
        },
        {
          id: 5,
          name: 'Ещё',
          lastMessageDate: '—',
          messages: [],
        },
      ],
      activeChatId: 2,
    });

    const next = chatReducer(prev, addChat());

    expect(next.chats).toHaveLength(3);
    expect(next.chats[0].id).toBe(6);
    expect(next.chats[0].name).toBe('Новый чат 6');
    expect(next.activeChatId).toBe(6);
  });

  it('deleteChat (DELETE_CHAT): удаляет чат; при удалении активного сбрасывает activeChatId', () => {
    const prev = emptyState({
      chats: [
        { id: 1, name: 'A', lastMessageDate: '—', messages: [] },
        { id: 2, name: 'B', lastMessageDate: '—', messages: [] },
      ],
      activeChatId: 1,
    });

    const next = chatReducer(prev, deleteChat(1));

    expect(next.chats.map((c) => c.id)).toEqual([2]);
    expect(next.activeChatId).toBe(2);
  });

  it('deleteChat: при удалении неактивного чата activeChatId не меняется', () => {
    const prev = emptyState({
      chats: [
        { id: 1, name: 'A', lastMessageDate: '—', messages: [] },
        { id: 2, name: 'B', lastMessageDate: '—', messages: [] },
      ],
      activeChatId: 1,
    });

    const next = chatReducer(prev, deleteChat(2));

    expect(next.chats.map((c) => c.id)).toEqual([1]);
    expect(next.activeChatId).toBe(1);
  });

  it('renameChat (RENAME_CHAT): обновляет название по id', () => {
    const prev = emptyState({
      chats: [
        { id: 1, name: 'Старое имя', lastMessageDate: '—', messages: [] },
      ],
    });

    const next = chatReducer(prev, renameChat({ id: 1, name: 'Новое имя' }));

    expect(next.chats[0].name).toBe('Новое имя');
  });
});
