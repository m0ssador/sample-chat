import type { Chat, MessageData } from '../types/types';

export const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Обсуждение проекта GigaChat',
    lastMessageDate: 'Сегодня, 14:30',
    messages: [
      {
        id: 1,
        text: 'Привет! Как дела?',
        sender: 'user',
        timestamp: '14:00'
      },
      {
        id: 2,
        text: 'Здравствуйте! Всё хорошо, чем могу помочь?\n\nВот пример кода на Python:\n```python\ndef hello():\n    print("Hello, World!")\n```',
        sender: 'assistant',
        timestamp: '14:01'
      },
      {
        id: 3,
        text: 'Отлично, помоги с реализацией React-компонента.',
        sender: 'user',
        timestamp: '14:05'
      },
      {
        id: 4,
        text: 'Конечно! Вот базовый шаблон компонента:\n\n```jsx\nimport React from \'react\';\n\nconst MyComponent = () => {\n  return <div>Hello World</div>;\n};\n\nexport default MyComponent;\n```',
        sender: 'assistant',
        timestamp: '14:06'
      }
    ]
  },
  {
    id: 2,
    name: 'Идеи для нового функционала',
    lastMessageDate: 'Вчера, 18:15',
    messages: [
      {
        id: 5,
        text: 'Какие есть идеи по улучшению интерфейса?',
        sender: 'user',
        timestamp: '18:10'
      },
      {
        id: 6,
        text: 'Можно добавить:\n1. Тёмную тему\n2. Поиск по чатам\n3. Экспорт истории',
        sender: 'assistant',
        timestamp: '18:12'
      }
    ]
  },
  {
    id: 3,
    name: 'Отладка API запросов',
    lastMessageDate: 'Вчера, 16:45',
    messages: []
  },
  {
    id: 4,
    name: 'Дизайн системы',
    lastMessageDate: 'Позавчера, 11:30',
    messages: []
  },
  {
    id: 5,
    name: 'Планирование спринта',
    lastMessageDate: 'Позавчера, 09:20',
    messages: []
  }
];

export const mockMessages: MessageData[] = mockChats[0].messages;
