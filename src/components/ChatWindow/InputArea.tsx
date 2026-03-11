import React, { useState, useRef } from 'react';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Логика отправки
      setValue('');
    };

    return (
      <div className={styles.inputArea}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className={styles.textarea}
        />
        <div className={styles.actions}>
          <button
            className={styles.attachButton}
            title="Прикрепить изображение"
          >
            📷
          </button>
          <button
            className={styles.stopButton}
            disabled
            title="Остановить генерацию"
          >
            ⏹
          </button>
          <button
            className={`${styles.sendButton} ${value ? styles.active : ''}`}
            onClick={() => {
              // Логика отправки сообщения
              setValue('');
              adjustHeight();
            }}
            disabled={!value}
          >
            Отправить
          </button>
        </div>
      </div>
    );
  }
};

export default InputArea;