import React, { useCallback, useEffect, useRef, useState } from 'react';
import AssistantMarkdown from './AssistantMarkdown';
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

function CheckIcon() {
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
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const Message: React.FC<MessageProps> = ({
  variant,
  content,
  timestamp,
  name,
}) => {
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = setTimeout(() => {
        setCopied(false);
        copiedTimerRef.current = null;
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, [content]);

  const showCopyFeedback = variant === 'assistant' && copied;
  const wrapperClass = [
    styles.wrapper,
    styles[`wrap_${variant}`],
    showCopyFeedback ? styles.copyFeedback : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {variant === 'assistant' && (
        <div className={styles.copyRow}>
          <button
            type="button"
            className={styles.copyButton}
            onClick={handleCopy}
            aria-label={
              showCopyFeedback
                ? 'Текст скопирован в буфер обмена'
                : 'Копировать текст сообщения'
            }
            title={showCopyFeedback ? 'Скопировано' : 'Копировать'}
          >
            {showCopyFeedback ? (
              <>
                <CheckIcon />
                <span className={styles.copiedLabel}>Скопировано</span>
              </>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>
      )}
      <div className={`${styles.message} ${styles[variant]}`}>
        {variant === 'assistant' && <div className={styles.avatar}>G</div>}
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.sender}>{name}</span>
            <span className={styles.timestamp}>{timestamp}</span>
          </div>
          {variant === 'assistant' ? (
            <AssistantMarkdown content={content} />
          ) : (
            <div className={styles.userPlain}>{content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
