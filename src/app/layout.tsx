import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';

const ClientShell = dynamic(() => import('./ClientShell'), {
  ssr: false,
  loading: () => <div className="appRoot" aria-busy="true" />,
});

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
