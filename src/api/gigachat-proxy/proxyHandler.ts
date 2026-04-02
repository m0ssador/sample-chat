import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import { isInsecureSslFlag } from './env';
import { pumpWebStreamToResponse, readRequestBody } from './httpUtils';
import { CHAT_COMPLETIONS_PATH, HEALTH_PATH } from './paths';
import { createUpstreamFetch } from './upstreamFetch';

type TokenCache = { tok: string; exp: number };

type ConnectNext = () => void;

/**
 * Connect-style middleware: прокси GigaChat (OAuth + chat/completions).
 */
export function createGigaChatProxyMiddleware(
  env: Record<string, string>,
): (req: IncomingMessage, res: ServerResponse, next: ConnectNext) => void {
  let tokenCache: TokenCache | null = null;
  const upstreamFetch = createUpstreamFetch(env);

  async function obtainToken(): Promise<string> {
    const key = env.GIGACHAT_AUTHORIZATION_KEY;
    if (!key?.trim()) {
      throw new Error(
        'GIGACHAT_AUTHORIZATION_KEY не задан.',
      );
    }

    const now = Date.now();
    if (tokenCache && tokenCache.exp > now + 60_000) {
      return tokenCache.tok;
    }

    const authUrl =
      env.GIGACHAT_AUTH_URL ||
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
    const scope = env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS';
    const rqUid = crypto.randomUUID();
    const body = new URLSearchParams({ scope });

    const oauthRes = await upstreamFetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${key.trim()}`,
        RqUID: rqUid,
        Accept: 'application/json',
        'User-Agent': 'ts-react-vite-app-gigachat-proxy',
      },
      body: body.toString(),
    });

    if (!oauthRes.ok) {
      const t = await oauthRes.text();
      throw new Error(`OAuth ${oauthRes.status}: ${t.slice(0, 240)}`);
    }

    const data = (await oauthRes.json()) as {
      tok?: string;
      access_token?: string;
      exp?: number;
    };
    const tok = data.tok ?? data.access_token;
    if (!tok) {
      throw new Error('OAuth: в ответе нет tok');
    }

    const expMs =
      typeof data.exp === 'number' ? data.exp : now + 300000;
    tokenCache = { tok, exp: expMs };
    return tok;
  }

  return function gigaChatProxy(
    req: IncomingMessage,
    res: ServerResponse,
    next: ConnectNext,
  ): void {
    const pathOnly = (req.url ?? '/').split('?')[0] ?? '';

    if (pathOnly === HEALTH_PATH && req.method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          ok: true,
          hasAuthorizationKey: Boolean(env.GIGACHAT_AUTHORIZATION_KEY?.trim()),
          insecureSsl: isInsecureSslFlag(env.GIGACHAT_INSECURE_SSL),
        }),
      );
      return;
    }

    if (pathOnly !== CHAT_COMPLETIONS_PATH || req.method !== 'POST') {
      next();
      return;
    }

    void (async () => {
      try {
        const raw = await readRequestBody(req);

        let payload: {
          messages?: unknown;
          stream?: boolean;
          model?: string;
        };
        try {
          payload = JSON.parse(raw) as typeof payload;
        } catch {
          res.statusCode = 400;
          return;
        }

        const systemPrompt =
          env.GIGACHAT_SYSTEM_PROMPT?.trim() ||
          'Отвечай кратко и по существу.';

        const userMessages = Array.isArray(payload.messages)
          ? payload.messages
          : [];

        const messages = [{ role: 'system', content: systemPrompt }, ...userMessages];

        const model = payload.model || env.GIGACHAT_MODEL || 'GigaChat';
        const stream = Boolean(payload.stream);

        const apiBase =
          env.GIGACHAT_API_BASE ||
          'https://gigachat.devices.sberbank.ru/api/v1';

        const forward = async (bearer: string) =>
          upstreamFetch(`${apiBase}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: stream ? 'text/event-stream' : 'application/json',
              Authorization: `Bearer ${bearer}`,
              'User-Agent': 'ts-react-vite-app-gigachat-proxy',
            },
            body: JSON.stringify({
              model,
              messages,
              stream,
            }),
          });

        let token = await obtainToken();
        let upstream = await forward(token);

        if (upstream.status === 401) {
          tokenCache = null;
          token = await obtainToken();
          upstream = await forward(token);
        }

        if (!upstream.ok) {
          const errText = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              error: `GigaChat HTTP ${upstream.status}`,
              details: errText.slice(0, 800),
            }),
          );
          return;
        }

        if (stream && upstream.body) {
          res.statusCode = 200;
          const ct = upstream.headers.get('content-type');
          if (ct) {
            res.setHeader('Content-Type', ct);
          }
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('X-Accel-Buffering', 'no');
          await pumpWebStreamToResponse(upstream.body, res);
          return;
        }

        const buf = Buffer.from(await upstream.arrayBuffer());
        res.statusCode = 200;
        res.setHeader(
          'Content-Type',
          upstream.headers.get('content-type') ||
            'application/json; charset=utf-8',
        );
        res.end(buf);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Ошибка прокси GigaChat';
        console.error('[gigachat-proxy]', e);
        if (!res.headersSent) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: message }));
        } else if (!res.writableEnded) {
          res.end();
        }
      }
    })();
  };
}
