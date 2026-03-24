import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';

export interface MessageProps {
  id: number;
  variant: 'user' | 'assistant';
  content: string;
  timestamp: string;
  name: string;
}

function CopyIcon() {
  return (
    <svg
      className={styles.copyIcon}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

const Message: React.FC<MessageProps> = ({
  variant,
  content,
  timestamp,
  name,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className={`${styles.wrapper} ${styles[`wrap_${variant}`]}`}>
      <div className={styles.copyRow}>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="Копировать текст сообщения"
          title="Копировать"
        >
          <CopyIcon />
        </button>
      </div>
      <div className={`${styles.message} ${styles[variant]}`}>
        {variant === 'assistant' && <div className={styles.avatar}>G</div>}
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.sender}>{name}</span>
            <span className={styles.timestamp}>{timestamp}</span>
          </div>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
