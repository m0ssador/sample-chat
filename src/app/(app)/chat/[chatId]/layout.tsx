import type { ReactNode } from 'react';

const STATIC_EXPORT = process.env.STATIC_EXPORT === '1';
const MAX_PREBUILT_CHAT_IDS = 500;

export function generateStaticParams(): { chatId: string }[] {
  if (!STATIC_EXPORT) {
    return [];
  }
  return Array.from({ length: MAX_PREBUILT_CHAT_IDS }, (_, i) => ({
    chatId: String(i + 1),
  }));
}

export default function ChatIdSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
