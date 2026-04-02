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

const MOCK_ASSISTANT_TEXT =
  'Это автоматический ответ. Уточните, пожалуйста, детали — и я помогу точнее.';

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

  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awaitingAssistantRef = useRef(false);

  useEffect(
    () => () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
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

      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }

      const delayMs = 3000 + Math.random() * 1000;
      replyTimeoutRef.current = setTimeout(() => {
        replyTimeoutRef.current = null;
        const assistantMessage: Message = {
          id: selectNextMessageId(store.getState()),
          role: 'assistant',
          content: MOCK_ASSISTANT_TEXT,
          timestamp: formatNowTime(),
        };
        dispatch(
          appendAssistantMessage({
            chatId,
            message: assistantMessage,
            lastMessageDate: nowLabel,
          }),
        );
        dispatch(stopLoading());
        awaitingAssistantRef.current = false;
      }, delayMs);
    },
    [activeChat?.id, dispatch, store],
  );

  const handleStop = useCallback(() => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
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
