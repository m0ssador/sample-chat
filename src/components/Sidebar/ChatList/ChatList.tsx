import React from 'react';
import ChatItem from './ChatItem';
import { mockChats } from '../../../mocks/data';
import styles from './ChatList.module.css';

interface ChatListProps {
  onSettingsOpen: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSettingsOpen }) => {
  return (
    <div className={styles.chatList}>
      {mockChats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          onEdit={() => alert('Редактировать чат')}
          onDelete={() => alert('Удалить чат')}
        />
      ))}
    </div>
  );
};

export default ChatList;
