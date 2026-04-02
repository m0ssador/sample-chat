import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';
import { useAppDispatch, useAppStore } from '../../store/hooks';
import { addChat } from '../../store/chatSlice';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate }) => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const navigate = useNavigate();

  const handleNewChat = () => {
    dispatch(addChat());
    const id = store.getState().chat.activeChatId;
    if (id != null) {
      navigate(`/chat/${id}`);
      onNavigate?.();
    }
  };

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
