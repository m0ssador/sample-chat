import React, { useState } from 'react';
import type { Chat } from '../../../types/types';
import styles from './ChatItem.module.css';

interface ChatItemProps {
  chat: Chat;
  onEdit: () => void;
  onDelete: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`${styles.chatItem}`}
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
          <button onClick={onEdit} className={styles.editButton}>
            ✏️
          </button>
          <button onClick={onDelete} className={styles.deleteButton}>
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
