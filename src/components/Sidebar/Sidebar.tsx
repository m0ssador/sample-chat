import React from 'react';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearch: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onSearch }) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.header}>
        <button
          className={styles.burgerButton}
          onClick={onToggle}
          type="button"
          aria-label="Открыть меню"
        >
          ☰
        </button>
        <NewChatButton />
      </div>
      <SearchInput onSearch={onSearch} />
      <ChatList />
    </aside>
  );
};

export default Sidebar;
