/**
 * Точка входа: HTTP-сервис прокси GigaChat (запускайте параллельно с Vite или через npm run dev:full).
 */
import { config } from 'dotenv';
import { createServer } from 'node:http';
import { mergeGigaChatEnv, isInsecureSslFlag } from './env';
import { CHAT_COMPLETIONS_PATH, HEALTH_PATH } from './paths';
import { createGigaChatProxyMiddleware } from './proxyHandler';

config();

const env = mergeGigaChatEnv({});

if (isInsecureSslFlag(env.GIGACHAT_INSECURE_SSL)) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const port = Number(env.GIGACHAT_PROXY_PORT || 8787);
const middleware = createGigaChatProxyMiddleware(env);

const server = createServer((req, res) => {
  middleware(req, res, () => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found');
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(
    `[gigachat-proxy] http://0.0.0.0:${port} (${CHAT_COMPLETIONS_PATH}, ${HEALTH_PATH})`,
  );
});
