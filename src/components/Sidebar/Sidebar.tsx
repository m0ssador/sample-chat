'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';
import { useAppDispatch, useAppStore } from '@/store/hooks';
import { addChat } from '@/store/chatSlice';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate }) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const router = useRouter();

  const handleNewChat = useCallback(() => {
    dispatch(addChat());
    const id = store.getState().chat.activeChatId;
    if (id != null) {
      router.push(`/chat/${id}`);
      onNavigate?.();
    }
  }, [dispatch, onNavigate, router, store]);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.header}>
        <NewChatButton className={styles.newChatButton} onClick={handleNewChat} />
      </div>
      <SearchInput />
      <ChatList onNavigate={onNavigate} />
    </aside>
  );
};

export default Sidebar;
