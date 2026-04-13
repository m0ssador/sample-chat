import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const staticExport = process.env.STATIC_EXPORT === '1';
const basePath = (process.env.BASE_PATH ?? '').replace(/\/$/, '') || undefined;

const nextConfig: NextConfig = {
  ...(staticExport ? { output: 'export' as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  env: {
    GIGACHAT_PROXY_URL: process.env.GIGACHAT_PROXY_URL ?? '',
    /** Дублируем в NEXT_PUBLIC_, иначе на статическом экспорте иногда не попадает в клиентский бандл. */
    NEXT_PUBLIC_GIGACHAT_PROXY_URL:
      process.env.NEXT_PUBLIC_GIGACHAT_PROXY_URL ?? process.env.GIGACHAT_PROXY_URL ?? '',
    /** Для загрузки gigachat-proxy.json и относительного /api при деплое в подкаталог Pages. */
    NEXT_PUBLIC_PAGES_BASE_PATH: basePath ?? '',
  },
};

export default withBundleAnalyzer(nextConfig);
