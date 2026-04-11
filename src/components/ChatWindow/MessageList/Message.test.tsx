import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      <Message
        id={1}
        variant="user"
        content={text}
        timestamp="12:00"
        name="Вы"
      />,
    );

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.user}`)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Копировать/i }),
    ).not.toBeInTheDocument();
  });

  it('variant=assistant: текст, класс ассистента и кнопка «Копировать»', () => {
    const text = 'Ответ ассистента';
    const { container } = render(
      <Message
        id={2}
        variant="assistant"
        content={text}
        timestamp="12:01"
        name="GigaChat"
      />,
    );

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.assistant}`)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Копировать/i }),
    ).toBeInTheDocument();
  });
});
