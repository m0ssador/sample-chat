import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import Sidebar from './Sidebar';
import { createAppStore } from '@/store/store';
import type { Chat } from '@/store/chatTypes';
import { chatInitialState } from '@/store/chatSlice';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  usePathname: () => '/',
}));

function makeStore(chats: Chat[]) {
  return createAppStore({
    initialChat: {
      ...chatInitialState,
      chats,
      activeChatId: chats[0]?.id ?? null,
      searchQuery: '',
    },
    initialAuth: { isAuthenticated: true },
  });
}

describe('Sidebar', () => {
  beforeEach(() => {
    push.mockClear();
  });

  const sampleChats: Chat[] = [
    {
      id: 1,
      name: 'Проект Альфа',
      lastMessageDate: 'Сегодня',
      messages: [],
    },
    {
      id: 2,
      name: 'Заметки бета',
      lastMessageDate: 'Вчера',
      messages: [],
    },
    {
      id: 3,
      name: 'Гамма релиз',
      lastMessageDate: 'Позавчера',
      messages: [],
    },
  ];

  it('фильтрует список чатов по названию при вводе в поиск', async () => {
    const user = userEvent.setup();
    const store = makeStore(sampleChats);

    render(
      <Provider store={store}>
        <Sidebar isOpen />
      </Provider>,
    );

    expect(screen.getByText('Проект Альфа')).toBeInTheDocument();
    expect(screen.getByText('Заметки бета')).toBeInTheDocument();

    const search = screen.getByRole('searchbox', {
      name: /Поиск по названию чата/i,
    });
    await user.type(search, 'бета');

    expect(screen.queryByText('Проект Альфа')).not.toBeInTheDocument();
    expect(screen.getByText('Заметки бета')).toBeInTheDocument();
  });

  it('при пустом поиске отображаются все чаты', async () => {
    const user = userEvent.setup();
    const store = makeStore(sampleChats);

    render(
      <Provider store={store}>
        <Sidebar isOpen />
      </Provider>,
    );

    const search = screen.getByRole('searchbox', {
      name: /Поиск по названию чата/i,
    });
    await user.type(search, 'гамма');
    expect(screen.queryByText('Проект Альфа')).not.toBeInTheDocument();

    await user.clear(search);

    expect(screen.getByText('Проект Альфа')).toBeInTheDocument();
    expect(screen.getByText('Заметки бета')).toBeInTheDocument();
    expect(screen.getByText('Гамма релиз')).toBeInTheDocument();
  });

  it('по кнопке «Удалить» открывается подтверждение', async () => {
    const user = userEvent.setup();
    const store = makeStore(sampleChats);

    render(
      <Provider store={store}>
        <Sidebar isOpen />
      </Provider>,
    );

    const row = screen.getByText('Проект Альфа').closest('[role="button"]');
    expect(row).toBeTruthy();
    fireEvent.mouseEnter(row!);

    const deleteBtn = await screen.findByRole('button', {
      name: /Удалить чат «Проект Альфа»/i,
    });
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Удалить чат?' }),
      ).toBeInTheDocument();
    });
  });
});
