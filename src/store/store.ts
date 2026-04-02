import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import {
  chatPersistenceMiddleware,
  loadPersistedChatState,
} from './chatPersistence';

const persistedChat = loadPersistedChatState();

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  preloadedState: persistedChat ? { chat: persistedChat } : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
