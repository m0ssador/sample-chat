import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputArea from './InputArea';

describe('InputArea', () => {
  it('при непустом вводе и клике «Отправить» вызывает onSend с текстом', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const onStop = vi.fn();

    render(
      <InputArea onSend={onSend} onStop={onStop} isLoading={false} />,
    );

    await user.type(screen.getByPlaceholderText('Введите сообщение...'), '  Привет  ');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('Привет');
  });

  it('при Enter без Shift с непустым вводом вызывает onSend', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(
      <InputArea onSend={onSend} onStop={vi.fn()} isLoading={false} />,
    );

    const field = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(field, 'Текст{Enter}');

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('Текст');
  });

  it('кнопка «Отправить» disabled при пустом поле', () => {
    render(<InputArea onSend={vi.fn()} onStop={vi.fn()} isLoading={false} />);

    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });
});
