import type { IncomingMessage } from 'node:http';

function headerOne(
  src: IncomingMessage['headers'],
  name: string,
): string | undefined {
  const v = src[name.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return v;
}

/**
 * Значение Access-Control-Allow-Origin: при пустом / * в env — отражаем Origin запроса (нужно для SSE и строгих браузеров).
 */
export function accessControlAllowOrigin(
  requestOrigin: string | undefined,
  configured: string | undefined,
): string {
  const c = (configured ?? '').trim();
  if (c && c !== '*') return c;
  const o = (requestOrigin ?? '').trim();
  return o || '*';
}

export function accessControlAllowHeadersFromIncoming(req: IncomingMessage): string {
  const raw = headerOne(req.headers, 'access-control-request-headers');
  if (raw?.trim()) return raw;
  return 'Content-Type, Accept, Authorization, Cache-Control, Pragma';
}

export function accessControlAllowHeadersFromWeb(request: Request): string {
  const raw = request.headers.get('access-control-request-headers');
  if (raw?.trim()) return raw;
  return 'Content-Type, Accept, Authorization, Cache-Control, Pragma';
}
