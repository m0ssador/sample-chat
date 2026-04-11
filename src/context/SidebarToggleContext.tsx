'use client';

import React, { createContext, useContext } from 'react';

const SidebarToggleContext = createContext<() => void>(() => {});

export function SidebarToggleProvider({
  value,
  children,
}: {
  value: () => void;
  children: React.ReactNode;
}) {
  return (
    <SidebarToggleContext.Provider value={value}>
      {children}
    </SidebarToggleContext.Provider>
  );
}

export function useSidebarToggle(): () => void {
  return useContext(SidebarToggleContext);
}
