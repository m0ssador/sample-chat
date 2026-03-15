import React, { useState, useRef, useEffect } from 'react';
import styles from './InputArea.module.css';

const InputArea: React.FC = () => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    console.log('Отправляем сообщение:', value);
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.inputArea}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className={styles.textarea}
      />
      <div className={styles.actions}>
        <button
          className={`${styles.sendButton} ${value ? styles.active : ''}`}
          onClick={handleSend}
          disabled={!value}
          type="button"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default InputArea;
