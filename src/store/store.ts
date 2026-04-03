import { configureStore } from '@reduxjs/toolkit';
import chatReducer, { chatInitialState } from './chatSlice';
import authReducer, { AUTH_SESSION_KEY } from './authSlice';
import {
  chatPersistenceMiddleware,
  loadPersistedChatState,
} from './chatPersistence';
const persistedChat = loadPersistedChatState();

const authPreload = {
  isAuthenticated:
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem(AUTH_SESSION_KEY) === '1',
};

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
  preloadedState: {
    chat: persistedChat ?? chatInitialState,
    auth: authPreload,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
