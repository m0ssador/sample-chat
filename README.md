# Чат на Next.js + React + Redux + GigaChat

Учебный проект по дисциплине «Основы фронтенда»: несколько чатов, история сообщений, маршрутизация, локальное сохранение и ответы ассистента через **GigaChat API** (через dev-прокси).

## Функциональность

- **Чаты**: создание, переименование, удаление с подтверждением, автозаголовок по первому сообщению.
- **Поиск** по названию и тексту последнего сообщения.
- **Маршруты** `/` и `/chat/:id` (Next.js App Router); прямой заход по URL и refresh восстанавливают активный чат.
- **Redux Toolkit**: состояние чатов, стриминг и полные ответы ассистента, индикатор загрузки.
- **localStorage**: персистентность списка чатов и сообщений (с debounce при стриминге).
- **GigaChat**: OAuth и `chat/completions` на отдельном Node-сервисе `src/api/gigachat-proxy`; в браузер ключ не попадает. Поддержка SSE со fallback на обычный JSON.
- **Markdown** в ответах ассистента (`react-markdown`, `remark-gfm`) и подсветка кода (**Prism**), подгружаются отдельным чанком через `React.lazy` в `Message`.

## Скрипты

| Команда | Назначение |
|--------|------------|
| `npm run dev` | Next.js dev-сервер. |
| `npm run build` | Production-сборка Next.js. |
| `npm run analyze` | Сборка с **@next/bundle-analyzer** (treemap в браузере). |
| `npm run start` | Запуск production-сборки. |
| `npm run lint` | ESLint. |
| `npm run test` / `npm run test:run` | Vitest + Testing Library. |
| `npm run gigachat-proxy` | Поднять прокси на `127.0.0.1:8787` (или `GIGACHAT_PROXY_PORT`). |

## Аудит бандла

![Treemap аудита бандла (пример)](docs/bundle-analyzer-treemap.png)

## Настройка прокси GigaChat

Скопируйте `.env.example` в `.env`, задайте `GIGACHAT_AUTHORIZATION_KEY`. При ошибках TLS к серверам Сбера — `GIGACHAT_INSECURE_SSL=true` (только для разработки).

## Диаграмма компонентов

```mermaid
flowchart TB
  subgraph Entry["Точка входа"]
    Root["app/layout.tsx\n + ClientShell Provider"]
  end

  subgraph Routing["Маршрутизация"]
    App["app/(app)/…\n lazy ChatWindow"]
    Root --> App
    App --> AppLayout
  end

  subgraph Layout["Компоновка"]
    AppLayout["AppLayout\n lazy Sidebar"]
    AppLayout --> Sidebar
    AppLayout --> ChatWindow
  end

  subgraph SidebarUI["Боковая панель"]
    Sidebar["Sidebar"]
    NewChat["NewChatButton"]
    Search["SearchInput"]
    ChatList["ChatList\n memo ChatItem"]
    Modals["Rename / Delete\n модалки"]
    Sidebar --> NewChat
    Sidebar --> Search
    Sidebar --> ChatList
    ChatList --> Modals
  end

  subgraph ChatUI["Окно чата"]
    ChatWindow["ChatWindow\n useChatRouteSync"]
    MsgList["MessageList\n ErrorBoundary"]
    Input["InputArea"]
    Settings["lazy SettingsPanel"]
    ChatWindow --> MsgList
    ChatWindow --> Input
    ChatWindow --> Settings
  end

  subgraph State["Состояние"]
    Store["Redux\n chatSlice"]
    Persist["chatPersistence"]
    Store --> Persist
  end

  Sidebar --> Store
  ChatWindow --> Store
  ChatWindow --> GigaClient["gigachatClient"]

  subgraph DevInfra["Разработка"]
    Next["Next /api/gigachat"]
    Proxy["gigachat-proxy\n cli.ts"]
    GigaClient --> Next
    Next --> Proxy
  end

  subgraph External["Сбер"]
    Sber["GigaChat API"]
    Proxy --> Sber
  end

  subgraph Storage["Браузер"]
    LS["localStorage"]
    Persist --> LS
  end
```

## Технологический стек

React 19, TypeScript, Next.js 15, Redux Toolkit, react-redux, react-markdown, remark-gfm, Prism, undici (в прокси).
