import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import authReducer from './authSlice';
import {
  chatPersistenceMiddleware,
  loadPersistedChatState,
  persistChatState,
} from './chatPersistence';
import { setSearchQuery } from './chatSlice';
import type { Chat, ChatState } from './chatTypes';
import { createAppStore } from './store';

const STORAGE_KEY = 'ts-react-vite-chat-state-v1';

function validChat(overrides: Partial<Chat> = {}): Chat {
  return {
    id: 1,
    name: 'Тест',
    lastMessageDate: '—',
    messages: [
      {
        id: 1,
        role: 'user',
        content: 'привет',
        timestamp: '10:00',
      },
    ],
    ...overrides,
  };
}

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  } as Storage;
}

describe('chatPersistence + localStorage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage());
  });

  it('persistChatState сохраняет данные в localStorage', () => {
    const state: ChatState = {
      chats: [validChat()],
      activeChatId: 1,
      searchQuery: 'q',
      isLoading: false,
      error: null,
    };

    persistChatState(state);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.searchQuery).toBe('q');
    expect(parsed.chats).toHaveLength(1);
    expect(parsed.activeChatId).toBe(1);
  });

  it('loadPersistedChatState восстанавливает состояние из localStorage', () => {
    const payload = {
      chats: [validChat({ id: 7, name: 'Семь' })],
      activeChatId: 7,
      searchQuery: 'найти',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    const loaded = loadPersistedChatState();

    expect(loaded).not.toBeNull();
    expect(loaded!.chats[0].id).toBe(7);
    expect(loaded!.chats[0].name).toBe('Семь');
    expect(loaded!.activeChatId).toBe(7);
    expect(loaded!.searchQuery).toBe('найти');
    expect(loaded!.isLoading).toBe(false);
    expect(loaded!.error).toBeNull();
  });

  it('невалидный JSON в localStorage: loadPersistedChatState возвращает null без выброса', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');

    expect(() => loadPersistedChatState()).not.toThrow();
    expect(loadPersistedChatState()).toBeNull();
  });

  it('битая структура в localStorage: null, без падения', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats: 'oops' }));

    expect(loadPersistedChatState()).toBeNull();
  });

  it('при dispatch chat/* middleware пишет актуальный стор в localStorage', () => {
    const store = configureStore({
      reducer: { chat: chatReducer, auth: authReducer },
      preloadedState: {
        chat: {
          chats: [validChat()],
          activeChatId: 1,
          isLoading: false,
          error: null,
          searchQuery: '',
        },
        auth: { isAuthenticated: false },
      },
      middleware: (gdm) => gdm().concat(chatPersistenceMiddleware),
    });

    store.dispatch(setSearchQuery('фильтр'));

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).searchQuery).toBe('фильтр');
  });

  it('createAppStore подхватывает валидные данные из localStorage', () => {
    const payload = {
      chats: [validChat({ id: 2, name: 'Из хранилища' })],
      activeChatId: 2,
      searchQuery: '',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    const store = createAppStore();

    expect(store.getState().chat.chats[0].name).toBe('Из хранилища');
    expect(store.getState().chat.activeChatId).toBe(2);
  });

  it('createAppStore при битом JSON не падает и даёт начальное состояние чатов', () => {
    localStorage.setItem(STORAGE_KEY, '[[[');

    const store = createAppStore();
    expect(store.getState().chat.chats.length).toBeGreaterThan(0);
  });
});
