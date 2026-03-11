import React from 'react';
import TypingIndicator from '../TypingIndicator';
import Message from './Message';
import styles from './MessageList.module.css';
import type { MessageData } from '../../../types/message';


interface MessageListProps {
  messages: MessageData[];
  isTyping?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  return (
    <div className={styles.messageList}>
      {messages.map(msg => (
        <Message
          id={msg.id}
          text={msg.text}
          sender={msg.sender}
          name={msg.sender === 'user' ? 'Вы' : 'GigaChat'}
        />
      ))}
      {isTyping && <TypingIndicator isVisible={true} />}
    </div>
  );
};

export default MessageList;
