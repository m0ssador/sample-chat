import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatWindow from '../ChatWindow/ChatWindow';

import styles from './AppLayout.module.css';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(true);

  const handleToggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Обработчик для активации поиска
  const handleSearch = () => {
    setIsSearching(true);
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        onSearch={handleSearch}
      />
      <ChatWindow
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={handleToggleSettings}
      />
    </div>
  );
};

export default AppLayout;
