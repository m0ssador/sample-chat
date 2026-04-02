import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { mergeGigaChatEnv, isInsecureSslFlag } from './src/api/gigachat-proxy/env';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, process.cwd(), '');
  const env = mergeGigaChatEnv(loaded);

  if (isInsecureSslFlag(env.GIGACHAT_INSECURE_SSL)) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const proxyPort = env.GIGACHAT_PROXY_PORT || '8787';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/gigachat': {
          target: `http://127.0.0.1:${proxyPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
