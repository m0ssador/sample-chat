'use client';

import React, { lazy, Suspense, useState } from 'react';
import { SidebarToggleProvider } from '@/context/SidebarToggleContext';

import styles from './AppLayout.module.css';

const Sidebar = lazy(() => import('../Sidebar/Sidebar'));

function SidebarFallback() {
  return (
    <div className={styles.sidebarFallback} aria-hidden>
      Загрузка списка чатов…
    </div>
  );
}

function getInitialSidebarOpen(): boolean {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(max-width: 1024px)').matches;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarOpen);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarToggleProvider value={handleToggleSidebar}>
      <div className={styles.layout}>
        <button
          type="button"
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.sidebarBackdropVisible : ''}`}
          aria-label="Закрыть меню"
          aria-hidden={!isSidebarOpen}
          tabIndex={isSidebarOpen ? 0 : -1}
          onClick={() => setIsSidebarOpen(false)}
        />
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar
            isOpen={isSidebarOpen}
            onNavigate={() => setIsSidebarOpen(false)}
          />
        </Suspense>
        {children}
      </div>
    </SidebarToggleProvider>
  );
};

export default AppLayout;
