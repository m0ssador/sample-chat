import React, { useEffect, useRef } from 'react';
import TypingIndicator from '../TypingIndicator';
import Message from './Message';
import styles from './MessageList.module.css';
import type { ChatMessage } from '../../../types/types';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.messageList}>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          id={msg.id}
          variant={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
          name={msg.role === 'user' ? 'Вы' : 'GigaChat'}
        />
      ))}
      <TypingIndicator isVisible={isLoading} />
      <div ref={listEndRef} className={styles.anchor} aria-hidden />
    </div>
  );
};

export default MessageList;
