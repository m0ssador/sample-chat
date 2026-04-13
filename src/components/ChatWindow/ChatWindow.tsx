'use client';

import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import MessageList from './MessageList/MessageList';
import InputArea from './InputArea';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import styles from './ChatWindow.module.css';
import { useAppDispatch, useAppSelector, useAppStore } from '../../store/hooks';
import {
  appendAssistantMessage,
  appendUserMessage,
  clearError,
  setError,
  setLoading,
  stopLoading,
  updateAssistantMessageContent,
} from '../../store/chatSlice';
import {
  selectActiveChat,
  selectActiveChatMessages,
  selectChatError,
  selectChatLoading,
  selectNextMessageId,
} from '../../store/selectors';
import type { Message } from '../../store/chatTypes';
import { useSidebarToggle } from '@/context/SidebarToggleContext';
import { useChatRouteSync } from '../../hooks/useChatRouteSync';
import {
  messagesToGigaChatPayload,
  postGigaChatComplete,
  postGigaChatStream,
  type GigachatApiMessage,
} from '../../services/gigachatClient';

const SettingsPanel = lazy(() => import('../SettingsPanel/SettingsPanel'));

function SettingsPanelFallback() {
  return (
    <div className={styles.lazyFallback} aria-hidden>
      Загрузка настроек…
    </div>
  );
}

function formatNowTime(): string {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

type GigaRetryContext = {
  chatId: number;
  assistantId: number;
};

const ChatWindow: React.FC = () => {
  useChatRouteSync();

  const onToggleSidebar = useSidebarToggle();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const handleSettingsToggle = useCallback(() => {
    setIsSettingsOpen((o) => !o);
  }, []);

  const dispatch = useAppDispatch();
  const store = useAppStore();
  const messages = useAppSelector(selectActiveChatMessages);
  const activeChat = useAppSelector(selectActiveChat);
  const isLoading = useAppSelector(selectChatLoading);
  const error = useAppSelector(selectChatError);

  const abortRef = useRef<AbortController | null>(null);
  const awaitingAssistantRef = useRef(false);
  const gigaRetryRef = useRef<GigaRetryContext | null>(null);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const executeAssistantApi = useCallback(
    async (
      chatId: number,
      assistantId: number,
      apiMessages: GigachatApiMessage[],
      ac: AbortController,
    ) => {
      let acc = '';
      try {
        await postGigaChatStream(apiMessages, {
          signal: ac.signal,
          onDelta: (piece) => {
            acc += piece;
            dispatch(
              updateAssistantMessageContent({
                chatId,
                messageId: assistantId,
                content: acc,
              }),
            );
          },
        });

        if (acc.trim() === '') {
          const full = await postGigaChatComplete(apiMessages, {
            signal: ac.signal,
          });
          dispatch(
            updateAssistantMessageContent({
              chatId,
              messageId: assistantId,
              content: full,
            }),
          );
        }
        gigaRetryRef.current = null;
      } catch (e) {
        if (ac.signal.aborted) {
          return;
        }

        if (acc.trim() === '') {
          try {
            const full = await postGigaChatComplete(apiMessages, {
              signal: ac.signal,
            });
            dispatch(
              updateAssistantMessageContent({
                chatId,
                messageId: assistantId,
                content: full,
              }),
            );
            gigaRetryRef.current = null;
          } catch (e2) {
            const msg = e2 instanceof Error ? e2.message : 'Неизвестная ошибка';
            dispatch(
              updateAssistantMessageContent({
                chatId,
                messageId: assistantId,
                content: `Не удалось получить ответ: ${msg}`,
              }),
            );
            dispatch(setError(msg));
          }
        } else {
          const msg = e instanceof Error ? e.message : 'Ошибка потока';
          dispatch(
            setError(
              `Ответ получен не полностью (${msg}). Ниже — уже пришедший текст.`,
            ),
          );
        }
      } finally {
        abortRef.current = null;
        dispatch(stopLoading());
        awaitingAssistantRef.current = false;
      }
    },
    [dispatch],
  );

  const handleRetryGiga = useCallback(() => {
    const ctx = gigaRetryRef.current;
    if (ctx == null) return;

    dispatch(clearError());
    awaitingAssistantRef.current = true;
    dispatch(setLoading(true));

    const ac = new AbortController();
    abortRef.current = ac;

    const chatAfter = store
      .getState()
      .chat.chats.find((c) => c.id === ctx.chatId);
    const apiMessages = messagesToGigaChatPayload(chatAfter?.messages ?? []);

    void executeAssistantApi(ctx.chatId, ctx.assistantId, apiMessages, ac);
  }, [dispatch, executeAssistantApi, store]);

  const handleSend = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      const chatId = activeChat?.id;
      if (!trimmed || awaitingAssistantRef.current || chatId == null) {
        if (chatId == null) {
          gigaRetryRef.current = null;
          dispatch(setError('Выберите чат в списке слева'));
        }
        return;
      }

      dispatch(clearError());
      awaitingAssistantRef.current = true;

      const userMessage: Message = {
        id: selectNextMessageId(store.getState()),
        role: 'user',
        content: trimmed,
        timestamp: formatNowTime(),
      };

      const nowLabel = `Сегодня, ${formatNowTime()}`;

      dispatch(
        appendUserMessage({
          chatId,
          message: userMessage,
          lastMessageDate: nowLabel,
        }),
      );
      dispatch(setLoading(true));

      const assistantId = selectNextMessageId(store.getState());
      dispatch(
        appendAssistantMessage({
          chatId,
          message: {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: formatNowTime(),
          },
          lastMessageDate: nowLabel,
        }),
      );

      const ac = new AbortController();
      abortRef.current = ac;

      const chatAfter = store.getState().chat.chats.find((c) => c.id === chatId);
      const apiMessages = messagesToGigaChatPayload(chatAfter?.messages ?? []);

      gigaRetryRef.current = { chatId, assistantId };

      void executeAssistantApi(chatId, assistantId, apiMessages, ac);
    },
    [activeChat?.id, dispatch, executeAssistantApi, store],
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch(stopLoading());
    awaitingAssistantRef.current = false;
    gigaRetryRef.current = null;
  }, [dispatch]);

  const canRetryGiga = Boolean(error && gigaRetryRef.current);

  const title = activeChat?.name ?? 'Чат';

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <button
            type="button"
            className={styles.burgerButton}
            onClick={onToggleSidebar}
            aria-label="Открыть или закрыть меню чатов"
          >
            <span className={styles.burgerIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
          <h3 title={title}>{title}</h3>
        </div>
        <button
          type="button"
          onClick={handleSettingsToggle}
          className={styles.settingsButton}
        >
          ⚙️ Настройки
        </button>
      </div>

      <ErrorBoundary title="Не удалось отобразить сообщения.">
        <MessageList messages={messages} isLoading={isLoading} />
      </ErrorBoundary>

      <InputArea onSend={handleSend} onStop={handleStop} isLoading={isLoading} />

      {error ? (
        <div className={styles.inputErrorBlock}>
          <ErrorMessage message={error} />
          <div className={styles.inputErrorActions}>
            {canRetryGiga ? (
              <button
                type="button"
                className={styles.retryButton}
                onClick={handleRetryGiga}
              >
                Повторить
              </button>
            ) : null}
            <button
              type="button"
              className={styles.dismissButton}
              onClick={() => {
                gigaRetryRef.current = null;
                dispatch(clearError());
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}

      <Suspense fallback={<SettingsPanelFallback />}>
        <SettingsPanel
          isOpen={isSettingsOpen}
          onToggle={handleSettingsToggle}
        />
      </Suspense>
    </div>
  );
};

export default ChatWindow;
