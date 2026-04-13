import React, { memo, useState } from 'react';
import type { Chat } from '../../../store/chatTypes';
import styles from './ChatItem.module.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.chatItem} ${isActive ? styles.active : ''}`}
      onClick={() => onSelect(chat.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(chat.id);
        }
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={styles.info}>
        <div className={styles.name} title={chat.name}>
          {chat.name}
        </div>
        <div className={styles.date}>{chat.lastMessageDate}</div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(chat.id);
            }}
            className={styles.editButton}
            aria-label={`Переименовать чат «${chat.name}»`}
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
            className={styles.deleteButton}
            aria-label={`Удалить чат «${chat.name}»`}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(ChatItem);
