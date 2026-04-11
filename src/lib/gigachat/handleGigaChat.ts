import crypto from 'node:crypto';
import { mergeGigaChatEnv, isInsecureSslFlag } from '@/api/gigachat-proxy/env';
import { createUpstreamFetch } from '@/api/gigachat-proxy/upstreamFetch';
import {
  CHAT_COMPLETIONS_PATH,
  HEALTH_PATH,
} from '@/api/gigachat-proxy/paths';

type TokenCache = { tok: string; exp: number };

let tokenCache: TokenCache | null = null;

async function obtainToken(
  env: Record<string, string>,
  upstreamFetch: typeof fetch,
): Promise<string> {
  const key = env.GIGACHAT_AUTHORIZATION_KEY;
  if (!key?.trim()) {
    throw new Error('GIGACHAT_AUTHORIZATION_KEY не задан.');
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
      'User-Agent': 'next-gigachat-proxy',
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

  const expMs = typeof data.exp === 'number' ? data.exp : now + 300000;
  tokenCache = { tok, exp: expMs };
  return tok;
}

/**
 * Обработка запросов к /api/gigachat/* (Route Handler Next.js).
 */
export async function handleGigaChat(
  request: Request,
  pathname: string,
): Promise<Response> {
  const env = mergeGigaChatEnv(process.env as Record<string, string>);
  if (isInsecureSslFlag(env.GIGACHAT_INSECURE_SSL)) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const upstreamFetch = createUpstreamFetch(env);

  if (pathname === HEALTH_PATH && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        ok: true,
        hasAuthorizationKey: Boolean(env.GIGACHAT_AUTHORIZATION_KEY?.trim()),
        insecureSsl: isInsecureSslFlag(env.GIGACHAT_INSECURE_SSL),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  }

  if (pathname !== CHAT_COMPLETIONS_PATH || request.method !== 'POST') {
    return new Response('Not found', { status: 404 });
  }

  try {
    const raw = await request.text();
    let payload: {
      messages?: unknown;
      stream?: boolean;
      model?: string;
    };
    try {
      payload = JSON.parse(raw) as typeof payload;
    } catch {
      return new Response(null, { status: 400 });
    }

    const systemPrompt =
      env.GIGACHAT_SYSTEM_PROMPT?.trim() || 'Отвечай кратко и по существу.';

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
          'User-Agent': 'next-gigachat-proxy',
        },
        body: JSON.stringify({
          model,
          messages,
          stream,
        }),
      });

    let token = await obtainToken(env, upstreamFetch);
    let upstream = await forward(token);

    if (upstream.status === 401) {
      tokenCache = null;
      token = await obtainToken(env, upstreamFetch);
      upstream = await forward(token);
    }

    if (!upstream.ok) {
      const errText = await upstream.text();
      return new Response(
        JSON.stringify({
          error: `GigaChat HTTP ${upstream.status}`,
          details: errText.slice(0, 800),
        }),
        {
          status: upstream.status,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    if (stream && upstream.body) {
      const headers = new Headers();
      const ct = upstream.headers.get('content-type');
      if (ct) headers.set('Content-Type', ct);
      headers.set('Cache-Control', 'no-cache');
      headers.set('X-Accel-Buffering', 'no');
      return new Response(upstream.body, { status: 200, headers });
    }

    const buf = await upstream.arrayBuffer();
    const headers = new Headers();
    headers.set(
      'Content-Type',
      upstream.headers.get('content-type') || 'application/json; charset=utf-8',
    );
    return new Response(buf, { status: 200, headers });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Ошибка прокси GigaChat';
    console.error('[gigachat]', e);
    return new Response(JSON.stringify({ error: message }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
