import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';
import type { MessageData } from '../../../types/types';

interface MessageProps extends MessageData {
  name: string;
}

const Message: React.FC<MessageProps> = ({ text, sender, name = 'User' }) => {
  const [showCopy, setShowCopy] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={`${styles.message} ${styles[sender]}`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {sender === 'assistant' && (
        <div className={styles.avatar}>G</div>
      )}
      <div className={styles.content}>
        <div className={styles.sender}>{name}</div>
        <ReactMarkdown >{text}</ReactMarkdown>
        {showCopy && (
          <button className={styles.copyButton} onClick={handleCopy}>
            Копировать
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
