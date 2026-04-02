import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatItem from './ChatItem';
import RenameChatModal from '../RenameChatModal';
import DeleteChatModal from '../DeleteChatModal';
import styles from './ChatList.module.css';
import { useAppDispatch, useAppSelector, useAppStore } from '../../../store/hooks';
import { renameChat, deleteChat } from '../../../store/chatSlice';
import {
  selectActiveChatId,
  selectChats,
  selectFilteredChats,
  selectSearchQuery,
} from '../../../store/selectors';

interface ChatListProps {
  onNavigate?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onNavigate }) => {
  const chats = useAppSelector(selectChats);
  const filtered = useAppSelector(selectFilteredChats);
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeChatId = useAppSelector(selectActiveChatId);
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [renameTarget, setRenameTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleSelectChat = (id: number) => {
    navigate(`/chat/${id}`);
    onNavigate?.();
  };

  const handleConfirmDelete = (deletedId: number) => {
    const onDeletedChatPage = location.pathname === `/chat/${deletedId}`;
    dispatch(deleteChat(deletedId));
    if (onDeletedChatPage) {
      const { chats: nextChats, activeChatId: nextActive } = store.getState().chat;
      if (nextChats.length === 0) {
        navigate('/', { replace: true });
      } else if (nextActive != null) {
        navigate(`/chat/${nextActive}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
    onNavigate?.();
  };

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
            onSelect={() => handleSelectChat(chat.id)}
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
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ChatList;
