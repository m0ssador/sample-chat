'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

/**
 * Вся оболочка с Redux только на клиенте — иначе гидрация не совпадёт с localStorage/sessionStorage.
 */
export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <div className="appRoot">{children}</div>
    </Provider>
  );
}
