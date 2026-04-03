import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

import styles from './AppLayout.module.css';

export interface AppLayoutOutletContext {
  onToggleSidebar: () => void;
}

function getInitialSidebarOpen(): boolean {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(max-width: 1024px)').matches;
}

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarOpen);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={styles.layout}>
      <button
        type="button"
        className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.sidebarBackdropVisible : ''}`}
        aria-label="Закрыть меню"
        aria-hidden={!isSidebarOpen}
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={() => setIsSidebarOpen(false)}
      />
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      <Outlet
        context={
          { onToggleSidebar: handleToggleSidebar } satisfies AppLayoutOutletContext
        }
      />
    </div>
  );
};

export default AppLayout;
