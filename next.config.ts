import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.producthunt.com' },
      { protocol: 'https', hostname: '**.ph-cdn.com' }
    ]
  }
};

export default nextConfig;
