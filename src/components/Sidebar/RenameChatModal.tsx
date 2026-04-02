import React, { useEffect, useState } from 'react';
import styles from './RenameChatModal.module.css';

interface RenameTarget {
  id: number;
  name: string;
}

interface RenameChatModalProps {
  target: RenameTarget | null;
  onClose: () => void;
  onSave: (id: number, name: string) => void;
}

interface InnerProps {
  target: RenameTarget;
  onClose: () => void;
  onSave: (id: number, name: string) => void;
}

const RenameChatModalInner: React.FC<InnerProps> = ({
  target,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState(() => target.name);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (trimmed.length > 0) {
      onSave(target.id, trimmed);
    }
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-chat-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rename-chat-title" className={styles.title}>
          Переименовать чат
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            id="rename-chat-input"
            className={styles.field}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            maxLength={120}
            aria-label="Название чата"
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RenameChatModal: React.FC<RenameChatModalProps> = ({
  target,
  onClose,
  onSave,
}) => {
  if (!target) return null;
  return (
    <RenameChatModalInner
      key={target.id}
      target={target}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

export default RenameChatModal;
