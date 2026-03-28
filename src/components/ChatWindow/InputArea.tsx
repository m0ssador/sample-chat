import React, { useState } from 'react';
import styles from './InputArea.module.css';

interface InputAreaProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, onStop, isLoading }) => {
  const [value, setValue] = useState('');

  const hasSendableText = value.trim().length > 0;
  const sendDisabled = !hasSendableText || isLoading;

  const submitMessage = () => {
    const text = value.trim();
    if (!text || isLoading) return;
    onSend(text);
    setValue('');
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <form className={styles.inputArea} onSubmit={handleFormSubmit} noValidate>
      <div className={styles.textareaGrow} data-replicated-value={value}>
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className={styles.textarea}
          disabled={isLoading}
          rows={1}
        />
      </div>
      <div className={styles.actions}>
        {isLoading ? (
          <button className={styles.stopButton} type="button" onClick={onStop}>
            Стоп
          </button>
        ) : (
          <button className={styles.sendButton} type="submit" disabled={sendDisabled}>
            Отправить
          </button>
        )}
      </div>
    </form>
  );
};

export default InputArea;
