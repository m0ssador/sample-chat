'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ChatItem from './ChatItem';
import RenameChatModal from '../RenameChatModal';
import DeleteChatModal from '../DeleteChatModal';
import styles from './ChatList.module.css';
import { useAppDispatch, useAppSelector, useAppStore } from '@/store/hooks';
import { renameChat, deleteChat } from '@/store/chatSlice';
import {
  selectActiveChatId,
  selectChats,
  selectSearchQuery,
  filterChatsBySearchQuery,
} from '@/store/selectors';

interface ChatListProps {
  onNavigate?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onNavigate }) => {
  const chats = useAppSelector(selectChats);
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeChatId = useAppSelector(selectActiveChatId);
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const filtered = useMemo(
    () => filterChatsBySearchQuery(chats, searchQuery),
    [chats, searchQuery],
  );

  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const [renameTarget, setRenameTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleSelectChat = useCallback(
    (id: number) => {
      router.push(`/chat/${id}`);
      onNavigate?.();
    },
    [router, onNavigate],
  );

  const handleEditChat = useCallback((id: number) => {
    const c = chatsRef.current.find((x) => x.id === id);
    if (c) setRenameTarget({ id, name: c.name });
  }, []);

  const handleDeleteChat = useCallback((id: number) => {
    const c = chatsRef.current.find((x) => x.id === id);
    if (c) setDeleteTarget({ id, name: c.name });
  }, []);

  const handleConfirmDelete = useCallback(
    (deletedId: number) => {
      const onDeletedChatPage = pathname === `/chat/${deletedId}`;
      dispatch(deleteChat(deletedId));
      if (onDeletedChatPage) {
        const { chats: nextChats, activeChatId: nextActive } =
          store.getState().chat;
        if (nextChats.length === 0) {
          router.replace('/');
        } else if (nextActive != null) {
          router.replace(`/chat/${nextActive}`);
        } else {
          router.replace('/');
        }
      }
      onNavigate?.();
    },
    [dispatch, onNavigate, pathname, router, store],
  );

  const handleRenameSave = useCallback(
    (id: number, name: string) => {
      dispatch(renameChat({ id, name }));
    },
    [dispatch],
  );

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
            onSelect={handleSelectChat}
            onEdit={handleEditChat}
            onDelete={handleDeleteChat}
          />
        ))}
      </div>
      <RenameChatModal
        target={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSave={handleRenameSave}
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
