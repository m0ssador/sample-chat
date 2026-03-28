import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageList from './MessageList/MessageList';
import InputArea from './InputArea';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import type { ChatMessage } from '../../types/types';
import styles from './ChatWindow.module.css';

import { mockMessages } from '../../mocks/data';

const initialMessages: ChatMessage[] = mockMessages.map((m) => ({
  id: m.id,
  role: m.sender,
  content: m.text,
  timestamp: m.timestamp,
}));

const MOCK_ASSISTANT_TEXT =
  'Это автоматический ответ. Уточните, пожалуйста, детали — и я помогу точнее.';

function formatNowTime(): string {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ChatWindowProps {
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isSettingsOpen, onToggleSettings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const nextIdRef = useRef(
    initialMessages.reduce((max, m) => Math.max(max, m.id), 0) + 1,
  );
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

  const handleSend = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed || awaitingAssistantRef.current) return;

    awaitingAssistantRef.current = true;

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: 'user',
      content: trimmed,
      timestamp: formatNowTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    const delayMs = 3000 + Math.random() * 1000;
    replyTimeoutRef.current = setTimeout(() => {
      replyTimeoutRef.current = null;
      const assistantMessage: ChatMessage = {
        id: nextIdRef.current++,
        role: 'assistant',
        content: MOCK_ASSISTANT_TEXT,
        timestamp: formatNowTime(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      awaitingAssistantRef.current = false;
    }, delayMs);
  }, []);

  const handleStop = useCallback(() => {
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setIsLoading(false);
    awaitingAssistantRef.current = false;
  }, []);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <h3>Обсуждение проекта</h3>
        <button type="button" onClick={onToggleSettings} className={styles.settingsButton}>
          ⚙️ Настройки
        </button>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      <InputArea onSend={handleSend} onStop={handleStop} isLoading={isLoading} />

      <SettingsPanel isOpen={isSettingsOpen} onToggle={onToggleSettings} />
    </div>
  );
};

export default ChatWindow;
