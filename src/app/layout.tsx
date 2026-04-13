import type { Metadata } from 'next';
import ClientShell from './ClientShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Чат GigaChat',
  description: 'Чаты с ассистентом GigaChat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
