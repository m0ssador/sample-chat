'use client';

import React, { lazy, Suspense } from 'react';
import ChatRouteFallback from '@/components/ChatWindow/ChatRouteFallback';

const ChatWindow = lazy(() =>
  import(
    /* webpackChunkName: "route-home-chatwindow" */
    '@/components/ChatWindow/ChatWindow'
  ),
);

export default function HomePage() {
  return (
    <Suspense fallback={<ChatRouteFallback />}>
      <ChatWindow />
    </Suspense>
  );
}
