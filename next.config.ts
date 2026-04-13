import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  env: {
    GIGACHAT_PROXY_URL: process.env.GIGACHAT_PROXY_URL ?? '',
  },
};

export default withBundleAnalyzer(nextConfig);
