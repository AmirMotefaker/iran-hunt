import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.producthunt.com' },
      { protocol: 'https', hostname: '**.ph-cdn.com' }
    ]
  }
};

export default nextConfig;
