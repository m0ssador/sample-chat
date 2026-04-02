import React from 'react';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';
import { useAppDispatch } from '../../store/hooks';
import { addChat } from '../../store/chatSlice';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useAppDispatch();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.header}>
        <NewChatButton
          className={styles.newChatButton}
          onClick={() => dispatch(addChat())}
        />
      </div>
      <SearchInput />
      <ChatList />
    </aside>
  );
};

export default Sidebar;
