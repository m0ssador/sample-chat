import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Message from './Message';
import styles from './Message.module.css';

describe('Message', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  it('variant=user: текст и класс пользователя', () => {
    const text = 'Сообщение пользователя';
    const { container } = render(
      <Suspense fallback={null}>
        <Message
          id={1}
          variant="user"
          content={text}
          timestamp="12:00"
          name="Вы"
        />
      </Suspense>,
    );

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.user}`)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Копировать/i }),
    ).not.toBeInTheDocument();
  });

  it('variant=assistant: текст, класс ассистента и кнопка «Копировать»', async () => {
    const text = 'Ответ ассистента';
    const { container } = render(
      <Suspense fallback={null}>
        <Message
          id={2}
          variant="assistant"
          content={text}
          timestamp="12:01"
          name="GigaChat"
        />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
    expect(container.querySelector(`.${styles.assistant}`)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Копировать/i }),
    ).toBeInTheDocument();
  });
});
