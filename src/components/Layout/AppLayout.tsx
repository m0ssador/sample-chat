import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatWindow from '../ChatWindow/ChatWindow';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ theme, onToggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(true);

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearch={() => setIsSearching(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
      />
      <ChatWindow
        isSettingsOpen={isSettingsOpen}
        onCloseSettings={() => setIsSettingsOpen(false)}
      />
      <button
        className="theme-toggle-button"
        onClick={onToggleTheme}
        aria-label={`Переключить тему на ${theme === 'light' ? 'тёмную' : 'светлую'}`}
      >
        {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
      </button>
    </div>
  );
};

export default AppLayout;
