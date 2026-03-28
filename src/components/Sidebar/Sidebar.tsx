import React from 'react';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onSearch: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onSearch }) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.header}>
        <NewChatButton className={styles.newChatButton} />
      </div>
      <SearchInput onSearch={onSearch} />
      <ChatList />
    </aside>
  );
};

export default Sidebar;
