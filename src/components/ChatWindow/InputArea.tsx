import React, { useState, useRef, useEffect } from 'react';
import styles from './InputArea.module.css';

interface InputAreaProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const disableInput = isLoading;
  const disableSend = !value.trim() || isLoading;

  return (
    <div className={styles.inputArea}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className={styles.textarea}
        disabled={disableInput}
        rows={1}
      />
      <div className={styles.actions}>
        <button
          className={`${styles.sendButton} ${value.trim() ? styles.active : ''}`}
          onClick={handleSend}
          disabled={disableSend}
          type="button"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default InputArea;
