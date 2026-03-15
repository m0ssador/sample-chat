import React from 'react';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearch:(query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onSearch }) => {
  return (
    <aside>
      <button onClick={onToggle}>
        ☰
      </button>
      <NewChatButton />
      <SearchInput onSearch={onSearch} />
      <ChatList />
    </aside>
  );
};

export default Sidebar;
