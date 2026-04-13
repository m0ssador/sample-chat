declare namespace NodeJS {
  interface ProcessEnv {
    /** Базовый URL внешнего gigachat-proxy (без завершающего `/`). Пусто — относительный путь к Next API. */
    GIGACHAT_PROXY_URL?: string;
  }
}
