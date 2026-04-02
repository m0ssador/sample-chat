import React, { useState } from 'react';
import ChatItem from './ChatItem';
import RenameChatModal from '../RenameChatModal';
import DeleteChatModal from '../DeleteChatModal';
import styles from './ChatList.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setActiveChatId,
  renameChat,
  deleteChat,
} from '../../../store/chatSlice';
import {
  selectActiveChatId,
  selectChats,
  selectFilteredChats,
  selectSearchQuery,
} from '../../../store/selectors';

const ChatList: React.FC = () => {
  const chats = useAppSelector(selectChats);
  const filtered = useAppSelector(selectFilteredChats);
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeChatId = useAppSelector(selectActiveChatId);
  const dispatch = useAppDispatch();

  const [renameTarget, setRenameTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  if (chats.length === 0) {
    return (
      <div className={styles.chatList}>
        <p className={styles.empty}>Нет чатов. Создайте новый кнопкой выше.</p>
      </div>
    );
  }

  if (filtered.length === 0 && searchQuery.trim() !== '') {
    return (
      <div className={styles.chatList}>
        <p className={styles.empty}>Ничего не найдено по запросу.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.chatList}>
        {filtered.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onSelect={() => dispatch(setActiveChatId(chat.id))}
            onEdit={() => setRenameTarget({ id: chat.id, name: chat.name })}
            onDelete={() =>
              setDeleteTarget({ id: chat.id, name: chat.name })
            }
          />
        ))}
      </div>
      <RenameChatModal
        target={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSave={(id, name) => dispatch(renameChat({ id, name }))}
      />
      <DeleteChatModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => dispatch(deleteChat(id))}
      />
    </>
  );
};

export default ChatList;
