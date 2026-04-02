/** Допустимая длина названия (диапазон 30–40 символов с учётом многоточия) */
const TITLE_MAX_LEN = 38;
/** Минимум значимых символов; короче — остаётся название по умолчанию */
const TITLE_MIN_LEN = 3;

/**
 * Название чата по тексту первого сообщения или запасной вариант.
 */
export function titleFromFirstUserMessage(
  rawContent: string,
  fallbackTitle: string,
): string {
  const normalized = rawContent.replace(/\s+/g, ' ').trim();
  if (normalized.length < TITLE_MIN_LEN) {
    return fallbackTitle;
  }
  if (normalized.length <= TITLE_MAX_LEN) {
    return normalized;
  }
  return `${normalized.slice(0, TITLE_MAX_LEN - 1).trimEnd()}…`;
}

/** Имя только что созданного чата (`Новый чат` или `Новый чат 12`) */
export function isDefaultNewChatName(name: string): boolean {
  return /^Новый чат(?: \d+)?$/.test(name);
}
