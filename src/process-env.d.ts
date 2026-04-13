declare namespace NodeJS {
  interface ProcessEnv {
    /** Базовый URL внешнего gigachat-proxy (без завершающего `/`). Пусто — относительный путь к Next API. */
    GIGACHAT_PROXY_URL?: string;
    /** Копия для клиента (Pages / статический экспорт). */
    NEXT_PUBLIC_GIGACHAT_PROXY_URL?: string;
    /** basePath деплоя, например `/repo` для project site. */
    NEXT_PUBLIC_PAGES_BASE_PATH?: string;
  }
}
