import fs from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const staticExport = process.env.STATIC_EXPORT === '1';
const basePath = (process.env.BASE_PATH ?? '').replace(/\/$/, '') || undefined;

/** Читается при загрузке конфига — после шага CI, который создаёт файл. */
function readGigachatProxyFromPublicJson(): string {
  try {
    const file = path.join(process.cwd(), 'public', 'gigachat-proxy.json');
    if (!fs.existsSync(file)) return '';
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as { url?: unknown };
    return typeof parsed.url === 'string' ? parsed.url.trim() : '';
  } catch {
    return '';
  }
}

function normalizeProxyBase(s: string): string {
  return s.trim().replace(/\/+$/, '');
}

const resolvedGigachatProxy = normalizeProxyBase(
  (process.env.NEXT_PUBLIC_GIGACHAT_PROXY_URL ?? '').trim() ||
    (process.env.GIGACHAT_PROXY_URL ?? '').trim() ||
    readGigachatProxyFromPublicJson(),
);

const nextConfig: NextConfig = {
  ...(staticExport ? { output: 'export' as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  env: {
    GIGACHAT_PROXY_URL: resolvedGigachatProxy,
    NEXT_PUBLIC_GIGACHAT_PROXY_URL: resolvedGigachatProxy,
    NEXT_PUBLIC_PAGES_BASE_PATH: basePath ?? '',
  },
};

export default withBundleAnalyzer(nextConfig);
