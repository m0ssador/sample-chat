import React, { useEffect } from 'react';
import styles from './DeleteChatModal.module.css';

interface DeleteChatModalProps {
  target: { id: number; name: string } | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  target,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, onClose]);

  if (!target) return null;

  const handleConfirm = () => {
    onConfirm(target.id);
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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-chat-title"
        aria-describedby="delete-chat-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-chat-title" className={styles.title}>
          Удалить чат?
        </h2>
        <p id="delete-chat-desc" className={styles.message}>
          Чат «<span className={styles.chatName}>{target.name}</span>» и его
          история будут удалены. Это действие нельзя отменить.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={styles.danger} onClick={handleConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
