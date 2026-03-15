import React from 'react';
import ChatItem from './ChatItem';
import { mockChats } from '../../../mocks/data';
import styles from './ChatList.module.css';

const ChatList: React.FC = () => {
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
