'use client';

import React, { lazy, Suspense } from 'react';
import ChatRouteFallback from '@/components/ChatWindow/ChatRouteFallback';

const ChatWindow = lazy(() =>
  import(
    /* webpackChunkName: "route-chatid-chatwindow" */
    '@/components/ChatWindow/ChatWindow'
  ),
);

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatRouteFallback />}>
      <ChatWindow />
    </Suspense>
  );
}
