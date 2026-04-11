import { configureStore } from '@reduxjs/toolkit';
import chatReducer, { chatInitialState } from './chatSlice';
import authReducer, { AUTH_SESSION_KEY } from './authSlice';
import {
  chatPersistenceMiddleware,
  loadPersistedChatState,
} from './chatPersistence';
import type { ChatState } from './chatTypes';

function readAuthPreload(): { isAuthenticated: boolean } {
  return {
    isAuthenticated:
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem(AUTH_SESSION_KEY) === '1',
  };
}

export type CreateAppStoreOptions = {
  /** Полное состояние чатов без чтения из localStorage (удобно для тестов). */
  initialChat?: ChatState;
  initialAuth?: { isAuthenticated: boolean };
};

/** Создаёт стор с актуальным `sessionStorage` / `localStorage`. */
export function createAppStore(options?: CreateAppStoreOptions) {
  const chatState =
    options?.initialChat ?? loadPersistedChatState() ?? chatInitialState;
  const authState = options?.initialAuth ?? readAuthPreload();

  return configureStore({
    reducer: {
      chat: chatReducer,
      auth: authReducer,
    },
    preloadedState: {
      chat: chatState,
      auth: authState,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(chatPersistenceMiddleware),
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
