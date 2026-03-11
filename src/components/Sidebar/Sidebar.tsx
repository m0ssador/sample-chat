import React from 'react';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import ChatList from './ChatList/ChatList';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearch:(query: string) => void;
  onSettingsOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onSearch, onSettingsOpen }) => {
  return (
    <aside>
      <button onClick={onToggle}>
        ☰
      </button>
      <NewChatButton />
      <SearchInput onSearch={onSearch} />
      <ChatList onSettingsOpen={onSettingsOpen} />
    </aside>
  );
};

export default Sidebar;
