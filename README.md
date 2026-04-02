# Чат на Vite + React + Redux + GigaChat

Учебный проект по дисциплине Основы фронтенда: несколько чатов, история сообщений, маршрутизация, локальное сохранение и ответы ассистента через **GigaChat API** (через dev-прокси).

## Функциональность

- **Чаты**: создание, переименование, удаление с подтверждением, автозаголовок по первому сообщению.
- **Поиск** по названию и тексту последнего сообщения.
- **Маршруты** `/` и `/chat/:id` (React Router); прямой заход по URL и refresh восстанавливают активный чат.
- **Redux Toolkit**: состояние чатов, стриминг и полные ответы ассистента, индикатор загрузки.
- **localStorage**: персистентность списка чатов и сообщений (с debounce при стриминге).
- **GigaChat**: OAuth и `chat/completions` на отдельном Node-сервисе `src/api/gigachat-proxy`; в браузер ключ не попадает. Поддержка SSE со fallback на обычный JSON.
- **Markdown** в ответах ассистента (`react-markdown`, `remark-gfm`) и подсветка кода (**Prism**).

## Скрипты

| Команда | Назначение |
|--------|------------|
| `npm run dev` | Только Vite (без прокси GigaChat запросы к `/api/gigachat` не дойдут). |
| `npm run gigachat-proxy` | Поднять прокси на `127.0.0.1:8787` (или `GIGACHAT_PROXY_PORT`). |
| `npm run dev:full` | Прокси + Vite одновременно. |
| `npm run build` | `tsc` + production-сборка. |
| `npm run lint` | ESLint. |

## Настройка прокси GigaChat
Скопируйте `.env.example` в `.env`, задайте `GIGACHAT_AUTHORIZATION_KEY`. При ошибках TLS к серверам Сбера — `GIGACHAT_INSECURE_SSL=true` (только для разработки).

## Диаграмма компонентов

```mermaid
flowchart TB
  subgraph Entry["Точка входа"]
    main["main.tsx\n Provider + BrowserRouter"]
  end

  subgraph Routing["Маршрутизация"]
    App["App.tsx\n Routes"]
    main --> App
    App --> AppLayout
  end

  subgraph Layout["Компоновка"]
    AppLayout["AppLayout\nSidebar + Outlet"]
    AppLayout --> Sidebar
    AppLayout --> ChatWindow
  end

  subgraph SidebarUI["Боковая панель"]
    Sidebar["Sidebar"]
    NewChat["NewChatButton"]
    Search["SearchInput"]
    ChatList["ChatList\n ChatItem"]
    Modals["Rename / Delete\n модалки"]
    Sidebar --> NewChat
    Sidebar --> Search
    Sidebar --> ChatList
    ChatList --> Modals
  end

  subgraph ChatUI["Окно чата"]
    ChatWindow["ChatWindow\n useChatRouteSync"]
    MsgList["MessageList\n AssistantMarkdown"]
    Input["InputArea"]
    Settings["SettingsPanel"]
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
    Vite["Vite proxy\n /api/gigachat"]
    Proxy["gigachat-proxy\n cli.ts"]
    GigaClient --> Vite
    Vite --> Proxy
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

React 19, TypeScript, Vite 7, Redux Toolkit, React Router 7, react-markdown, remark-gfm, Prism, undici (в прокси).
