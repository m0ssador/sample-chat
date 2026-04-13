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
  },
};

export default withBundleAnalyzer(nextConfig);
