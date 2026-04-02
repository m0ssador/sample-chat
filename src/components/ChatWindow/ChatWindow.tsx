import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import MessageList from './MessageList/MessageList';
import InputArea from './InputArea';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
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
import type { AppLayoutOutletContext } from '../Layout/AppLayout';
import { useChatRouteSync } from '../../hooks/useChatRouteSync';
import {
  messagesToGigaChatPayload,
  postGigaChatComplete,
  postGigaChatStream,
} from '../../services/gigachatClient';

function formatNowTime(): string {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ChatWindow: React.FC = () => {
  useChatRouteSync();

  const { onToggleSidebar } = useOutletContext<AppLayoutOutletContext>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const store = useAppStore();
  const messages = useAppSelector(selectActiveChatMessages);
  const activeChat = useAppSelector(selectActiveChat);
  const isLoading = useAppSelector(selectChatLoading);
  const error = useAppSelector(selectChatError);

  const abortRef = useRef<AbortController | null>(null);
  const awaitingAssistantRef = useRef(false);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const handleSend = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      const chatId = activeChat?.id;
      if (!trimmed || awaitingAssistantRef.current || chatId == null) {
        if (chatId == null) {
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

      let acc = '';

      const run = async () => {
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
            } catch (e2) {
              const msg =
                e2 instanceof Error ? e2.message : 'Неизвестная ошибка';
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
      };

      void run();
    },
    [activeChat?.id, dispatch, store],
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch(stopLoading());
    awaitingAssistantRef.current = false;
  }, [dispatch]);

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
            ☰
          </button>
          <h3 title={title}>{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsSettingsOpen((o) => !o)}
          className={styles.settingsButton}
        >
          ⚙️ Настройки
        </button>
      </div>

      {error ? (
        <div className={styles.errorBanner}>
          <ErrorMessage message={error} />
          <button type="button" className={styles.errorDismiss} onClick={() => dispatch(clearError())}>
            Закрыть
          </button>
        </div>
      ) : null}

      <MessageList messages={messages} isLoading={isLoading} />

      <InputArea onSend={handleSend} onStop={handleStop} isLoading={isLoading} />

      <SettingsPanel isOpen={isSettingsOpen} onToggle={() => setIsSettingsOpen((o) => !o)} />
    </div>
  );
};

export default ChatWindow;
